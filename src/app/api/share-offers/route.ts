import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireModuleTrust } from "@/lib/api/module-trust";
import { requireSession } from "@/lib/api/session";

const createSchema = z
  .object({
    title: z.string().min(2).max(120),
    dish_type: z.string().max(80).optional(),
    allergens: z.string().max(2000).optional(),
    quantity_parts: z.coerce.number().int().min(1).max(99),
    mode: z.enum(["gift", "chip_in"]),
    chip_in_amount_cents: z.coerce.number().int().min(0).optional(),
  })
  .strict();

export async function GET() {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(session.user.id, "share_offers_list", 60, 60_000);
  if (limited) return limited;

  const trust = await requireModuleTrust(session.user, session.supabase);
  if (!trust.ok) return trust.response;
  const city = trust.profile.city;

  const { data, error } = await session.supabase
    .from("share_offers")
    .select("*")
    .eq("status", "active")
    .neq("host_user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(48);

  if (error) {
    return jsonError("share_list_failed", "Impossible de charger les offres pour l’instant.", 500);
  }

  const rows = (data ?? []).filter(
    (o) => o.city && o.city.trim().length > 0 && o.city.trim().toLowerCase() === city.toLowerCase(),
  );

  return NextResponse.json({ offers: rows });
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(
    session.user.id,
    "share_offers_create",
    12,
    3_600_000,
    "Tu as publié souvent. Pause un peu avant une nouvelle offre.",
  );
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", "Corps JSON invalide.", 400);
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", parsed.error.flatten().formErrors.join("; "), 400);
  }

  if (parsed.data.mode === "chip_in" && (parsed.data.chip_in_amount_cents == null || parsed.data.chip_in_amount_cents < 50)) {
    return jsonError("validation_error", "Indique une participation d’au moins 0,50 € (50 centimes).", 400);
  }

  const trust = await requireModuleTrust(session.user, session.supabase);
  if (!trust.ok) return trust.response;
  const profile = trust.profile;

  const insert = {
    host_user_id: session.user.id,
    host_display_name: profile.display_name,
    host_photo_url: profile.photo_url,
    city: profile.city,
    title: parsed.data.title.trim(),
    dish_type: parsed.data.dish_type?.trim() || null,
    allergens: parsed.data.allergens?.trim() || null,
    quantity_parts: parsed.data.quantity_parts,
    mode: parsed.data.mode,
    chip_in_amount_cents: parsed.data.mode === "chip_in" ? parsed.data.chip_in_amount_cents! : null,
    status: "active" as const,
  };

  const { data, error } = await session.supabase.from("share_offers").insert(insert).select("*").single();

  if (error) {
    if (error.message.includes("share_offers") || error.code === "42P01") {
      return jsonError("schema_missing", "Module partage non déployé sur la base. Applique les migrations Supabase.", 503);
    }
    return jsonError("share_create_failed", "Publication impossible pour l’instant.", 400);
  }

  return NextResponse.json({ offer: data }, { status: 201 });
}
