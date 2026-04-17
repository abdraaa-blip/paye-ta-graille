import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

const kinds = ["first_experience", "first_meal", "overall_like"] as const;
type FeedbackKind = (typeof kinds)[number];

const postSchema = z
  .object({
    kind: z.enum(kinds),
    score: z.number().int().min(1).max(5),
    choice: z.string().max(40).optional().nullable(),
    note: z.string().max(500).optional().nullable(),
  })
  .strict();

function buildPrompt(kind: FeedbackKind) {
  if (kind === "first_experience") {
    return {
      kind,
      question: "Qu’as-tu pensé de ta première expérience sur Paye ta graille ?",
      options: [
        { score: 5, label: "Excellent" },
        { score: 4, label: "Top" },
        { score: 3, label: "Correct" },
        { score: 2, label: "Moyen" },
        { score: 1, label: "Difficile" },
      ],
    };
  }
  if (kind === "first_meal") {
    return {
      kind,
      question: "Comment s’est passé ton premier repas ?",
      options: [
        { score: 5, label: "Super moment" },
        { score: 4, label: "Très bien" },
        { score: 3, label: "Bien" },
        { score: 2, label: "Mitigé" },
        { score: 1, label: "À améliorer" },
      ],
    };
  }
  return {
    kind,
    question: "Aimes-tu Paye ta graille ?",
    options: [
      { score: 5, label: "J’adore" },
      { score: 4, label: "Oui beaucoup" },
      { score: 3, label: "Plutôt oui" },
      { score: 2, label: "Pas trop" },
      { score: 1, label: "Non" },
    ],
  };
}

function isValidChoiceForKind(kind: FeedbackKind, score: number, choice: string | null | undefined) {
  if (!choice) return true;
  const prompt = buildPrompt(kind);
  return prompt.options.some((opt) => opt.score === score && opt.label === choice);
}

export async function GET() {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const { data: feedbackRows, error: feedbackErr } = await session.supabase
    .from("user_feedback")
    .select("kind, score, choice, created_at")
    .eq("user_id", session.user.id);

  if (feedbackErr) {
    if (feedbackErr.code === "42P01") {
      return jsonError("feedback_unavailable", "Feedback indisponible pour l’instant.", 503);
    }
    return jsonError("feedback_fetch_failed", feedbackErr.message, 400);
  }

  const answeredKinds = new Set((feedbackRows ?? []).map((r) => r.kind as FeedbackKind));

  const { count: completedCount, error: mealsErr } = await session.supabase
    .from("meals")
    .select("id", { count: "exact", head: true })
    .eq("status", "completed")
    .or(`host_user_id.eq.${session.user.id},guest_user_id.eq.${session.user.id}`);

  if (mealsErr) {
    return jsonError("feedback_meals_failed", mealsErr.message, 400);
  }

  const prompts: ReturnType<typeof buildPrompt>[] = [];
  if (!answeredKinds.has("first_experience")) prompts.push(buildPrompt("first_experience"));
  if ((completedCount ?? 0) >= 1 && !answeredKinds.has("first_meal")) prompts.push(buildPrompt("first_meal"));
  if (!answeredKinds.has("overall_like")) prompts.push(buildPrompt("overall_like"));

  return NextResponse.json({
    prompts,
    next_prompt: prompts[0] ?? null,
    answers: feedbackRows ?? [],
    completed_meals: completedCount ?? 0,
  });
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = await rateLimitForUser(
    session.user.id,
    "feedback_post",
    20,
    3_600_000,
    "Merci, tu as déjà envoyé plusieurs évaluations récemment.",
  );
  if (limited) return limited;

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

  const payload = parsed.data;
  if (!isValidChoiceForKind(payload.kind, payload.score, payload.choice)) {
    return jsonError("validation_error", "Réponse incohérente pour cette question.", 400);
  }

  const { data, error } = await session.supabase
    .from("user_feedback")
    .upsert(
      {
        user_id: session.user.id,
        kind: payload.kind,
        score: payload.score,
        choice: payload.choice ?? null,
        note: payload.note ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,kind" },
    )
    .select("kind, score, choice, created_at, updated_at")
    .single();

  if (error) {
    if (error.code === "42P01") {
      return jsonError("feedback_unavailable", "Feedback indisponible pour l’instant.", 503);
    }
    return jsonError("feedback_save_failed", error.message, 400);
  }

  return NextResponse.json({ ok: true, feedback: data });
}
