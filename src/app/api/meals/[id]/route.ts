import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { venuesByMealId } from "@/lib/api/meal-venues";
import { requireUuidParam } from "@/lib/api/params";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";
import { assertMealStatusTransition, mealParticipantRole } from "@/lib/meal-transitions";

const potluckSlot = z.enum(["entree", "plat", "dessert", "boissons", "rien"]);

const potluckPatchSchema = z.object({
  mode: z.enum(["free", "balanced", "auto"]),
  assignments: z.record(z.string().uuid(), potluckSlot),
});

const patchSchema = z
  .object({
    status: z
      .enum([
        "matched",
        "cancelled",
        "venue_confirmed",
        "confirmed",
        "completed",
        "venue_proposed",
      ])
      .optional(),
    potluck: potluckPatchSchema.optional(),
  })
  .strict()
  .refine((b) => b.status !== undefined || b.potluck !== undefined, {
    message: "Fournis au moins status ou potluck.",
  });

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const { id } = await ctx.params;

  const { data: meal, error } = await session.supabase.from("meals").select("*").eq("id", id).maybeSingle();

  if (error) {
    return jsonError("meal_fetch_failed", error.message, 500);
  }
  if (!meal) {
    return jsonError("not_found", "Repas introuvable.", 404);
  }
  if (meal.host_user_id !== session.user.id && meal.guest_user_id !== session.user.id) {
    return jsonError("forbidden", "Tu n’es pas invité à ce repas.", 403);
  }

  const venueMap = await venuesByMealId(session.supabase, [id]);
  const venues = venueMap.get(id) ?? [];

  return NextResponse.json({ meal: { ...meal, venues } });
}

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(session.user.id, "meal_patch", 80, 60_000);
  if (limited) return limited;

  const { id: rawId } = await ctx.params;
  const idCheck = requireUuidParam(rawId, "Repas");
  if (!idCheck.ok) return idCheck.response;
  const { id } = idCheck;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", "Corps JSON invalide.", 400);
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", parsed.error.flatten().formErrors.join("; "), 400);
  }

  const { data: existing, error: fetchErr } = await session.supabase
    .from("meals")
    .select("id, status, host_user_id, guest_user_id, format")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr) {
    return jsonError("meal_fetch_failed", fetchErr.message, 500);
  }
  if (!existing) {
    return jsonError("not_found", "Repas introuvable.", 404);
  }
  if (existing.host_user_id !== session.user.id && existing.guest_user_id !== session.user.id) {
    return jsonError("forbidden", "Tu n’es pas invité à ce repas.", 403);
  }

  const format = existing.format ?? "duo";

  if (parsed.data.potluck) {
    if (format !== "group") {
      return jsonError("potluck_not_group", "L’organisation partagée n’existe que pour un repas groupe.", 400);
    }
    if (!existing.guest_user_id) {
      return jsonError("potluck_no_guest", "Pas encore d’invité·e : organisation indisponible.", 400);
    }
    const allowed = new Set([existing.host_user_id, existing.guest_user_id]);
    for (const uid of Object.keys(parsed.data.potluck.assignments)) {
      if (!allowed.has(uid)) {
        return jsonError("potluck_bad_participant", "Rôle réservé aux participant·es du repas.", 400);
      }
    }
  }

  const updatePayload: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) {
    const role = mealParticipantRole(
      session.user.id,
      existing.host_user_id,
      existing.guest_user_id,
    );
    const transition = assertMealStatusTransition(existing.status, parsed.data.status, role);
    if (!transition.ok) {
      return jsonError("meal_transition_invalid", transition.message, 400);
    }
    updatePayload.status = parsed.data.status;
  }
  if (parsed.data.potluck !== undefined) {
    updatePayload.potluck = parsed.data.potluck;
  }

  const { data, error } = await session.supabase
    .from("meals")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    const msg = error.message || error.details || "transition refusée";
    return jsonError("meal_transition_failed", msg, 400);
  }

  return NextResponse.json({ meal: data });
}
