import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

const bodySchema = z
  .object({
    detail: z.string().min(10).max(4000),
    contact: z.string().max(200).optional().nullable(),
    meal_id: z.string().uuid().optional().nullable(),
  })
  .strict();

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = await rateLimitForUser(
    session.user.id,
    "report_post",
    6,
    3_600_000,
    "Limite de signalements atteinte pour l’instant. Réessaie plus tard ou contacte le support.",
  );
  if (limited) return limited;

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

  if (parsed.data.meal_id) {
    const { data: meal } = await session.supabase
      .from("meals")
      .select("id, host_user_id, guest_user_id")
      .eq("id", parsed.data.meal_id)
      .maybeSingle();
    if (!meal) {
      return jsonError("meal_not_found", "Repas lié introuvable.", 400);
    }
    if (meal.host_user_id !== session.user.id && meal.guest_user_id !== session.user.id) {
      return jsonError("forbidden", "Tu ne participes pas à ce repas.", 403);
    }
  }

  const { data, error } = await session.supabase
    .from("reports")
    .insert({
      reporter_id: session.user.id,
      detail: parsed.data.detail,
      contact: parsed.data.contact ?? null,
      meal_id: parsed.data.meal_id ?? null,
    })
    .select("id, created_at")
    .single();

  if (error) {
    if (error.message.includes("reports") || error.code === "42P01") {
      return jsonError(
        "reports_table_missing",
        "Signalement indisponible pour l’instant. Réessaie plus tard.",
        503,
      );
    }
    return jsonError("report_failed", error.message, 400);
  }

  return NextResponse.json({ ok: true, report: data });
}
