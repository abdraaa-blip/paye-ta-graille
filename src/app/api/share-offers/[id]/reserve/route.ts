import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireModuleTrust } from "@/lib/api/module-trust";
import { requireSession } from "@/lib/api/session";

const bodySchema = z.object({ parts: z.coerce.number().int().min(1).max(20).optional() }).strict();

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const { id: offerId } = await ctx.params;
  if (!z.string().uuid().safeParse(offerId).success) {
    return jsonError("validation_error", "Offre invalide.", 400);
  }

  const limited = await rateLimitForUser(session.user.id, "share_reserve", 40, 60_000);
  if (limited) return limited;

  const trust = await requireModuleTrust(session.user, session.supabase);
  if (!trust.ok) return trust.response;

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", parsed.error.flatten().formErrors.join("; "), 400);
  }
  const parts = parsed.data.parts ?? 1;

  const { data: offer, error: oErr } = await session.supabase
    .from("share_offers")
    .select("id, host_user_id, quantity_parts, status")
    .eq("id", offerId)
    .single();

  if (oErr || !offer) {
    return jsonError("not_found", "Offre introuvable.", 404);
  }

  if (offer.status !== "active") {
    return jsonError("offer_closed", "Cette offre n’est plus disponible.", 400);
  }

  if (offer.host_user_id === session.user.id) {
    return jsonError("invalid_guest", "Tu ne peux pas réserver ta propre offre.", 400);
  }

  const { data: existing } = await session.supabase
    .from("share_reservations")
    .select("parts")
    .eq("offer_id", offerId)
    .in("status", ["pending", "confirmed"]);

  const used = (existing ?? []).reduce((s, r) => s + (r.parts ?? 0), 0);
  if (used + parts > offer.quantity_parts) {
    return jsonError("sold_out", "Il ne reste pas assez de parts.", 400);
  }

  const { data: res, error: rErr } = await session.supabase
    .from("share_reservations")
    .insert({
      offer_id: offerId,
      user_id: session.user.id,
      parts,
      status: "confirmed",
    })
    .select("*")
    .single();

  if (rErr) {
    if (rErr.code === "23505") {
      return jsonError("already_reserved", "Tu as déjà réservé sur cette offre.", 400);
    }
    return jsonError("reserve_failed", "Réservation impossible pour l’instant.", 400);
  }

  const newUsed = used + parts;
  if (newUsed >= offer.quantity_parts) {
    await session.supabase.from("share_offers").update({ status: "closed", updated_at: new Date().toISOString() }).eq("id", offerId);
  }

  return NextResponse.json({ reservation: res }, { status: 201 });
}
