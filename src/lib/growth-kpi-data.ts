import { createServiceRoleClient } from "@/lib/supabase/admin";

export type GrowthKpiDailyRow = {
  day: string;
  events_total: number;
  next_action_clicks: number;
  propose_clicks: number;
  invite_actions: number;
  partners_page_views: number;
  partners_cta_mailto: number;
  partners_cta_graille_plus: number;
  funnel_auth_success: number;
  funnel_discover_views: number;
  funnel_meals_proposed: number;
  funnel_meal_venues: number;
  funnel_meal_status_updates: number;
  funnel_onboarding_done: number;
  funnel_accueil_views: number;
  active_users: number;
  feedback_answers: number;
  feedback_avg_score: number | null;
};

const DEFAULT_DAYS = 30;
const MAX_DAYS = 366;

export function clampKpiDays(raw: string | null | undefined): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_DAYS;
  return Math.min(MAX_DAYS, Math.floor(n));
}

/**
 * Lecture agrégats globaux (contourne RLS sur `growth_events` via service role).
 */
export async function loadGrowthKpiDaily(days: number): Promise<
  | { ok: true; rows: GrowthKpiDailyRow[] }
  | { ok: false; reason: "no_service_role" | "query_failed"; detail?: string }
> {
  const admin = createServiceRoleClient();
  if (!admin) {
    return { ok: false, reason: "no_service_role" };
  }

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);
  const sinceDay = since.toISOString().slice(0, 10);

  const { data, error } = await admin
    .from("growth_kpi_daily")
       .select(
      [
        "day",
        "events_total",
        "next_action_clicks",
        "propose_clicks",
        "invite_actions",
        "partners_page_views",
        "partners_cta_mailto",
        "partners_cta_graille_plus",
        "funnel_auth_success",
        "funnel_discover_views",
        "funnel_meals_proposed",
        "funnel_meal_venues",
        "funnel_meal_status_updates",
        "funnel_onboarding_done",
        "funnel_accueil_views",
        "active_users",
      ].join(", "),
    )
    .gte("day", sinceDay)
    .order("day", { ascending: false });

  if (error) {
    return { ok: false, reason: "query_failed", detail: error.message };
  }

  const { data: feedbackData, error: feedbackError } = await admin
    .from("user_feedback")
    .select("created_at, score")
    .gte("created_at", `${sinceDay}T00:00:00.000Z`);

  if (feedbackError && feedbackError.code !== "42P01") {
    return { ok: false, reason: "query_failed", detail: feedbackError.message };
  }

  const feedbackByDay = new Map<string, { count: number; sum: number }>();
  for (const row of feedbackData ?? []) {
    const raw = row as unknown as Record<string, unknown>;
    const createdAt = String(raw.created_at ?? "");
    const day = createdAt.slice(0, 10);
    if (!day) continue;
    const score = Number(raw.score ?? 0);
    if (!Number.isFinite(score) || score <= 0) continue;
    const prev = feedbackByDay.get(day) ?? { count: 0, sum: 0 };
    prev.count += 1;
    prev.sum += score;
    feedbackByDay.set(day, prev);
  }

  const rows = (data ?? []).map((r) => {
    const row = r as unknown as Record<string, unknown>;
    const feedback = feedbackByDay.get(String(row.day ?? ""));
    return {
      day: String(row.day ?? ""),
      events_total: Number(row.events_total ?? 0),
      next_action_clicks: Number(row.next_action_clicks ?? 0),
      propose_clicks: Number(row.propose_clicks ?? 0),
      invite_actions: Number(row.invite_actions ?? 0),
      partners_page_views: Number(row.partners_page_views ?? 0),
      partners_cta_mailto: Number(row.partners_cta_mailto ?? 0),
      partners_cta_graille_plus: Number(row.partners_cta_graille_plus ?? 0),
      funnel_auth_success: Number(row.funnel_auth_success ?? 0),
      funnel_discover_views: Number(row.funnel_discover_views ?? 0),
      funnel_meals_proposed: Number(row.funnel_meals_proposed ?? 0),
      funnel_meal_venues: Number(row.funnel_meal_venues ?? 0),
      funnel_meal_status_updates: Number(row.funnel_meal_status_updates ?? 0),
      funnel_onboarding_done: Number(row.funnel_onboarding_done ?? 0),
      funnel_accueil_views: Number(row.funnel_accueil_views ?? 0),
      active_users: Number(row.active_users ?? 0),
      feedback_answers: feedback?.count ?? 0,
      feedback_avg_score: feedback && feedback.count > 0 ? Math.round((feedback.sum / feedback.count) * 100) / 100 : null,
    };
  });
  return { ok: true, rows };
}

export function partnersCtaTotal(row: GrowthKpiDailyRow): number {
  return row.partners_cta_mailto + row.partners_cta_graille_plus;
}

/** Taux de clic CTA partenaires / vues page (0–100), ou null si pas de vues. */
export function partnersCtrPercent(row: GrowthKpiDailyRow): number | null {
  const v = row.partners_page_views;
  if (v <= 0) return null;
  return Math.round((partnersCtaTotal(row) / v) * 1000) / 10;
}
