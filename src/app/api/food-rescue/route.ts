import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireModuleTrust } from "@/lib/api/module-trust";
import { requireSession } from "@/lib/api/session";

const createSchema = z
  .object({
    description: z.string().min(3).max(2000),
    price_cents: z.coerce.number().int().min(0).max(50_000).optional(),
    window_start: z.string().datetime({ offset: true }).optional(),
    window_end: z.string().datetime({ offset: true }).optional(),
    max_claims: z.coerce.number().int().min(1).max(10).optional(),
  })
  .strict();

export async function GET() {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(session.user.id, "food_rescue_list", 60, 60_000);
  if (limited) return limited;

  const trust = await requireModuleTrust(session.user, session.supabase);
  if (!trust.ok) return trust.response;
  const city = trust.profile.city;

  const { data, error } = await session.supabase
    .from("food_rescue_listings")
    .select("*")
    .eq("status", "active")
    .neq("publisher_user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(48);

  if (error) {
    return jsonError("rescue_list_failed", "Impossible de charger les surplus pour l’instant.", 500);
  }

  const rows = (data ?? []).filter(
    (o) => o.city && o.city.trim().length > 0 && o.city.trim().toLowerCase() === city.toLowerCase(),
  );

  return NextResponse.json({ listings: rows });
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(
    session.user.id,
    "food_rescue_create",
    20,
    3_600_000,
    "Tu as beaucoup publié. Une petite pause ?",
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

  const ws = parsed.data.window_start;
  const we = parsed.data.window_end;
  if ((ws && !we) || (!ws && we)) {
    return jsonError(
      "validation_error",
      "Créneau incomplet : indique le début et la fin (avec fuseau), ou laisse les deux vides.",
      400,
    );
  }
  if (ws && we && new Date(we) <= new Date(ws)) {
    return jsonError("validation_error", "La fin du créneau doit être après le début.", 400);
  }

  const trust = await requireModuleTrust(session.user, session.supabase);
  if (!trust.ok) return trust.response;
  const profile = trust.profile;

  const insert = {
    publisher_user_id: session.user.id,
    publisher_display_name: profile.display_name,
    publisher_photo_url: profile.photo_url,
    city: profile.city,
    description: parsed.data.description.trim(),
    price_cents: parsed.data.price_cents ?? 0,
    window_start: parsed.data.window_start ?? null,
    window_end: parsed.data.window_end ?? null,
    max_claims: parsed.data.max_claims ?? 1,
    status: "active" as const,
  };

  const { data, error } = await session.supabase.from("food_rescue_listings").insert(insert).select("*").single();

  if (error) {
    if (error.message.includes("food_rescue_listings") || error.code === "42P01") {
      return jsonError("schema_missing", "Module Seconde graille non déployé. Applique les migrations Supabase.", 503);
    }
    return jsonError("rescue_create_failed", "Publication impossible pour l’instant.", 400);
  }

  return NextResponse.json({ listing: data }, { status: 201 });
}
