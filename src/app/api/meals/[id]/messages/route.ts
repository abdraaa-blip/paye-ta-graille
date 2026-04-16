import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { requireUuidParam } from "@/lib/api/params";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

const postSchema = z.object({ body: z.string().min(1).max(4000) }).strict();

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const { id: mealId } = await ctx.params;

  const { data: meal, error: mErr } = await session.supabase
    .from("meals")
    .select("id, status, host_user_id, guest_user_id")
    .eq("id", mealId)
    .maybeSingle();

  if (mErr) {
    return jsonError("meal_fetch_failed", mErr.message, 500);
  }
  if (!meal) {
    return jsonError("not_found", "Repas introuvable.", 404);
  }
  if (meal.host_user_id !== session.user.id && meal.guest_user_id !== session.user.id) {
    return jsonError("forbidden", "Accès refusé.", 403);
  }

  const { data, error } = await session.supabase
    .from("meal_messages")
    .select("id, meal_id, sender_id, body, created_at")
    .eq("meal_id", mealId)
    .order("created_at", { ascending: true });

  if (error) {
    return jsonError("messages_fetch_failed", error.message, 500);
  }

  return NextResponse.json({ messages: data ?? [], meal_status: meal.status });
}

export async function POST(request: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = await rateLimitForUser(session.user.id, "meal_message_post", 40, 60_000);
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

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", parsed.error.flatten().formErrors.join("; "), 400);
  }

  const { data: meal, error: mErr } = await session.supabase
    .from("meals")
    .select("id, status, host_user_id, guest_user_id")
    .eq("id", mealId)
    .maybeSingle();

  if (mErr) {
    return jsonError("meal_fetch_failed", mErr.message, 500);
  }
  if (!meal) {
    return jsonError("not_found", "Repas introuvable.", 404);
  }
  if (meal.host_user_id !== session.user.id && meal.guest_user_id !== session.user.id) {
    return jsonError("forbidden", "Accès refusé.", 403);
  }
  if (!["venue_confirmed", "confirmed"].includes(meal.status)) {
    return jsonError(
      "chat_closed",
      "Le chat s’ouvre après confirmation du lieu (matrice produit A).",
      403,
    );
  }

  const { data, error } = await session.supabase
    .from("meal_messages")
    .insert({
      meal_id: mealId,
      sender_id: session.user.id,
      body: parsed.data.body,
    })
    .select("*")
    .single();

  if (error) {
    return jsonError("message_send_failed", error.message, 400);
  }

  return NextResponse.json({ message: data }, { status: 201 });
}
