import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { requireUuidParam } from "@/lib/api/params";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

const bodySchema = z
  .object({
    name: z.string().min(1).max(200),
    place_id: z.string().max(256).optional().nullable(),
    address: z.string().max(500).optional().nullable(),
    lat: z.number().finite().optional().nullable(),
    lng: z.number().finite().optional().nullable(),
  })
  .strict();

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = await rateLimitForUser(session.user.id, "venue_post", 30, 60_000);
  if (limited) return limited;

  const { id: rawMealId } = await ctx.params;
  const mealIdCheck = requireUuidParam(rawMealId, "Repas");
  if (!mealIdCheck.ok) return mealIdCheck.response;
  const mealId = mealIdCheck.id;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", "Corps JSON invalide.", 400);
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", parsed.error.flatten().formErrors.join("; "), 400);
  }

  const { data: meal, error: mealErr } = await session.supabase
    .from("meals")
    .select("id, status, host_user_id, guest_user_id")
    .eq("id", mealId)
    .maybeSingle();

  if (mealErr) {
    return jsonError("meal_fetch_failed", mealErr.message, 500);
  }
  if (!meal) {
    return jsonError("not_found", "Repas introuvable.", 404);
  }
  if (meal.host_user_id !== session.user.id) {
    return jsonError("forbidden", "Seul l’hôte peut proposer le lieu.", 403);
  }
  if (meal.status !== "matched" && meal.status !== "venue_proposed") {
    return jsonError("bad_state", "Le lieu ne peut être proposé qu’après match.", 400);
  }

  const venueRow = {
    meal_id: mealId,
    name: parsed.data.name,
    place_id: parsed.data.place_id ?? null,
    address: parsed.data.address ?? null,
    lat: parsed.data.lat ?? null,
    lng: parsed.data.lng ?? null,
    chosen_by: session.user.id,
  };

  const { data: venue, error: vErr } = await session.supabase
    .from("venues")
    .upsert(venueRow, { onConflict: "meal_id" })
    .select("*")
    .single();

  if (vErr) {
    return jsonError("venue_upsert_failed", vErr.message, 400);
  }

  if (meal.status === "matched") {
    const { data: updated, error: uErr } = await session.supabase
      .from("meals")
      .update({ status: "venue_proposed" })
      .eq("id", mealId)
      .select("*")
      .single();

    if (uErr) {
      return jsonError("meal_transition_failed", uErr.message, 400);
    }
    return NextResponse.json({ venue, meal: updated });
  }

  const { data: fullMeal } = await session.supabase.from("meals").select("*").eq("id", mealId).single();
  return NextResponse.json({ venue, meal: fullMeal });
}
