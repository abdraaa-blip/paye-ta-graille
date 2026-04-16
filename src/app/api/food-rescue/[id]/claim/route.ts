import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireModuleTrust } from "@/lib/api/module-trust";
import { requireSession } from "@/lib/api/session";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_CLAIMS_PER_WEEK = 12;

export async function POST(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const { id: listingId } = await ctx.params;
  if (!z.string().uuid().safeParse(listingId).success) {
    return jsonError("validation_error", "Annonce invalide.", 400);
  }

  const limited = rateLimitForUser(session.user.id, "food_rescue_claim", 30, 60_000);
  if (limited) return limited;

  const trust = await requireModuleTrust(session.user, session.supabase);
  if (!trust.ok) return trust.response;

  const since = new Date(Date.now() - WEEK_MS).toISOString();
  const { count, error: cErr } = await session.supabase
    .from("food_rescue_claims")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id)
    .eq("status", "confirmed")
    .gte("created_at", since);

  if (cErr) {
    return jsonError("quota_check_failed", "Impossible de vérifier ton quota pour l’instant.", 500);
  }

  if ((count ?? 0) >= MAX_CLAIMS_PER_WEEK) {
    return jsonError(
      "quota_exceeded",
      `Tu as déjà beaucoup réservé cette semaine (${MAX_CLAIMS_PER_WEEK} max). Réessaie la semaine prochaine.`,
      400,
    );
  }

  const { data: listing, error: lErr } = await session.supabase
    .from("food_rescue_listings")
    .select("id, publisher_user_id, max_claims, status, window_start, window_end")
    .eq("id", listingId)
    .single();

  if (lErr || !listing) {
    return jsonError("not_found", "Annonce introuvable.", 404);
  }

  if (listing.status !== "active") {
    return jsonError("listing_closed", "Cette annonce n’est plus disponible.", 400);
  }

  if (listing.publisher_user_id === session.user.id) {
    return jsonError("invalid_claim", "Tu ne peux pas réserver ta propre annonce.", 400);
  }

  const wStart = listing.window_start;
  const wEnd = listing.window_end;
  if (wStart && wEnd) {
    const now = Date.now();
    const t0 = new Date(wStart).getTime();
    const t1 = new Date(wEnd).getTime();
    if (!Number.isFinite(t0) || !Number.isFinite(t1)) {
      return jsonError("listing_invalid", "Créneau de l’annonce invalide.", 400);
    }
    if (now < t0 || now > t1) {
      return jsonError(
        "outside_window",
        "Cette annonce n’est réservable que pendant le créneau indiqué par l’hôte.",
        400,
      );
    }
  }

  const { count: claimCount, error: ccErr } = await session.supabase
    .from("food_rescue_claims")
    .select("*", { count: "exact", head: true })
    .eq("listing_id", listingId)
    .eq("status", "confirmed");

  if (ccErr) {
    return jsonError("claim_count_failed", "Impossible de vérifier les places restantes.", 500);
  }

  if ((claimCount ?? 0) >= listing.max_claims) {
    return jsonError("sold_out", "Plus de place sur cette annonce.", 400);
  }

  const { data: claim, error: claimErr } = await session.supabase
    .from("food_rescue_claims")
    .insert({
      listing_id: listingId,
      user_id: session.user.id,
      status: "confirmed",
    })
    .select("*")
    .single();

  if (claimErr) {
    if (claimErr.code === "23505") {
      return jsonError("already_claimed", "Tu as déjà réservé ce surplus.", 400);
    }
    return jsonError("claim_failed", "Réservation impossible pour l’instant.", 400);
  }

  const nextCount = (claimCount ?? 0) + 1;
  if (nextCount >= listing.max_claims) {
    await session.supabase
      .from("food_rescue_listings")
      .update({ status: "claimed_out", updated_at: new Date().toISOString() })
      .eq("id", listingId);
  }

  return NextResponse.json({ claim }, { status: 201 });
}
