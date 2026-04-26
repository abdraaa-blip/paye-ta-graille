import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { GrowthKpiDailyRow } from "@/lib/growth-kpi-data";
import type { getGrowthKpiThresholds } from "@/lib/growth-kpi-thresholds";
import { createInAppNotifications } from "@/lib/notifications/in-app";

type GrowthKpiThresholds = ReturnType<typeof getGrowthKpiThresholds>;

function parseAlertUserIds(): string[] {
  const raw = process.env.PTG_GROWTH_ALERT_USER_IDS?.trim();
  if (!raw) return [];
  return raw.split(/[\s,]+/).filter(Boolean);
}

function parseDecisionMakerUserIds(): string[] {
  const raw = process.env.PTG_GROWTH_DECISION_MAKER_USER_IDS?.trim();
  if (!raw) return [];
  return raw.split(/[\s,]+/).filter(Boolean);
}

function uniqueIds(ids: string[]): string[] {
  return Array.from(new Set(ids.filter(Boolean)));
}

type RiskLevel = "critical" | "attention" | "info";

function classifyWeeklyRisk(scoreDelta: number | null, feedbackDelta: number, thresholds: GrowthKpiThresholds): RiskLevel {
  if (scoreDelta !== null && scoreDelta <= thresholds.feedbackDeltaWarn - 0.12) return "critical";
  if (scoreDelta !== null && scoreDelta <= thresholds.feedbackDeltaWarn) return "attention";
  if (feedbackDelta <= thresholds.feedbackVolumeWarn) return "attention";
  return "info";
}

function readDigestHourParis(): number {
  const raw = process.env.PTG_GROWTH_DIGEST_HOUR_PARIS?.trim();
  const n = Number(raw);
  if (!Number.isFinite(n)) return 8;
  return Math.max(0, Math.min(23, Math.floor(n)));
}

function readWeeklyDigestHourParis(): number {
  const raw = process.env.PTG_GROWTH_WEEKLY_DIGEST_HOUR_PARIS?.trim();
  const n = Number(raw);
  if (!Number.isFinite(n)) return 9;
  return Math.max(0, Math.min(23, Math.floor(n)));
}

function readWeeklyDigestIsoDay(): number {
  const raw = process.env.PTG_GROWTH_WEEKLY_DIGEST_ISO_DAY?.trim();
  const n = Number(raw);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(7, Math.floor(n)));
}

function parisDateParts(date = new Date()): { year: number; month: number; day: number; isoDay: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(date);
  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const wd = String(lookup.weekday ?? "").toLowerCase();
  const isoDay =
    wd === "mon" ? 1 : wd === "tue" ? 2 : wd === "wed" ? 3 : wd === "thu" ? 4 : wd === "fri" ? 5 : wd === "sat" ? 6 : 7;
  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    isoDay,
  };
}

function isoDateFromParts(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function subtractDaysIso(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function currentParisHour(): number {
  const value = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Europe/Paris",
  }).format(new Date());
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export async function maybeCreateGrowthFeedbackAlert(rows: GrowthKpiDailyRow[], thresholds: GrowthKpiThresholds): Promise<void> {
  const alertUserIds = parseAlertUserIds();
  if (alertUserIds.length === 0) return;
  if (rows.length === 0) return;

  const recent = rows.slice(0, 7);
  const scoreSeries = [...rows]
    .reverse()
    .map((r) => r.feedback_avg_score)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  const baseline28 = avg(scoreSeries.slice(-28));
  const current7 = avg(
    recent.map((r) => r.feedback_avg_score).filter((v): v is number => typeof v === "number" && Number.isFinite(v)),
  );

  if (baseline28 === null || current7 === null) return;
  const baselineGap = current7 - baseline28;
  if (baselineGap > thresholds.feedbackBaselineGapWarn) return;

  const admin = createServiceRoleClient();
  if (!admin) return;

  const today = new Date().toISOString().slice(0, 10);
  const dayStart = `${today}T00:00:00.000Z`;
  const { data: existing, error } = await admin
    .from("user_notifications")
    .select("id")
    .eq("kind", "growth_feedback_alert")
    .gte("created_at", dayStart)
    .limit(1);

  if (error) return;
  if ((existing ?? []).length > 0) return;

  const gapLabel = baselineGap.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const baselineLabel = baseline28.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const currentLabel = current7.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  await createInAppNotifications(
    alertUserIds.map((userId) => ({
      userId,
      kind: "growth_feedback_alert",
      title: "Alerte satisfaction: baisse détectée",
      body: `Le score feedback 7j (${currentLabel}/5) est sous la baseline 28j (${baselineLabel}/5), écart ${gapLabel}.`,
      ctaHref: "/interne/croissance?jours=30",
      metadata: {
        alert_type: "feedback_baseline_gap",
        baseline_gap: baselineGap,
        baseline_28: baseline28,
        current_7: current7,
        threshold: thresholds.feedbackBaselineGapWarn,
        date: today,
      },
    })),
  );
}

export async function maybeCreateGrowthDailyDigest(rows: GrowthKpiDailyRow[], thresholds: GrowthKpiThresholds): Promise<boolean> {
  const alertUserIds = parseAlertUserIds();
  if (alertUserIds.length === 0) return false;
  if (rows.length === 0) return false;
  if (currentParisHour() !== readDigestHourParis()) return false;

  const admin = createServiceRoleClient();
  if (!admin) return false;

  const today = new Date().toISOString().slice(0, 10);
  const dayStart = `${today}T00:00:00.000Z`;
  const { data: existing, error } = await admin
    .from("user_notifications")
    .select("id")
    .eq("kind", "growth_daily_digest")
    .gte("created_at", dayStart)
    .limit(1);
  if (error) return false;
  if ((existing ?? []).length > 0) return false;

  const recent = rows.slice(0, 7);
  const previous = rows.slice(7, 14);
  const current7 = avg(recent.map((r) => r.feedback_avg_score).filter((v): v is number => typeof v === "number" && Number.isFinite(v)));
  const prev7 = avg(previous.map((r) => r.feedback_avg_score).filter((v): v is number => typeof v === "number" && Number.isFinite(v)));
  const scoreSeries = [...rows]
    .reverse()
    .map((r) => r.feedback_avg_score)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  const baseline28 = avg(scoreSeries.slice(-28));
  const feedbackCount7 = recent.reduce((sum, r) => sum + r.feedback_answers, 0);
  const activeUsers7 = recent.reduce((sum, r) => sum + r.active_users, 0);
  const inviteAttr7 = recent.reduce((sum, r) => sum + r.funnel_invite_attributions, 0);
  const feedbackEvt7 = recent.reduce((sum, r) => sum + r.funnel_feedback_submitted, 0);
  const surpriseRolls7 = recent.reduce((sum, r) => sum + r.funnel_surprise_graille_rolled, 0);
  const scoreDelta = current7 !== null && prev7 !== null ? current7 - prev7 : null;
  const baselineGap = current7 !== null && baseline28 !== null ? current7 - baseline28 : null;

  const title =
    baselineGap !== null && baselineGap <= thresholds.feedbackBaselineGapWarn
      ? "Digest croissance: attention feedback"
      : "Digest croissance: feedback stable";
  const body = [
    `7j note: ${current7 === null ? "-" : current7.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/5`,
    `Δ7j: ${scoreDelta === null ? "-" : scoreDelta.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `vs baseline28j: ${baselineGap === null ? "-" : baselineGap.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `feedback: ${feedbackCount7}`,
    `actifs: ${activeUsers7}`,
    `inv.attr.7j: ${inviteAttr7}`,
    `fb.evts.7j: ${feedbackEvt7}`,
    `surprise.7j: ${surpriseRolls7}`,
  ].join(" · ");

  await createInAppNotifications(
    alertUserIds.map((userId) => ({
      userId,
      kind: "growth_daily_digest",
      title,
      body,
      ctaHref: "/interne/croissance?jours=30",
      metadata: {
        digest_date: today,
        current7,
        prev7,
        baseline28,
        score_delta_7: scoreDelta,
        baseline_gap_28: baselineGap,
        feedback_count_7: feedbackCount7,
        active_users_7: activeUsers7,
        invite_attributions_7: inviteAttr7,
        feedback_events_7: feedbackEvt7,
        surprise_graille_rolled_7: surpriseRolls7,
        thresholds,
      },
    })),
  );
  return true;
}

export async function maybeCreateGrowthWeeklyDigest(rows: GrowthKpiDailyRow[], thresholds: GrowthKpiThresholds): Promise<boolean> {
  const alertUserIds = parseAlertUserIds();
  if (alertUserIds.length === 0) return false;
  if (rows.length === 0) return false;
  if (currentParisHour() !== readWeeklyDigestHourParis()) return false;

  const parisNow = parisDateParts();
  if (parisNow.isoDay !== readWeeklyDigestIsoDay()) return false;

  const admin = createServiceRoleClient();
  if (!admin) return false;

  const currentDateIso = isoDateFromParts(parisNow.year, parisNow.month, parisNow.day);
  const weekStartIso = subtractDaysIso(currentDateIso, parisNow.isoDay - 1);
  const weekStartUtc = `${weekStartIso}T00:00:00.000Z`;
  const { data: existing, error } = await admin
    .from("user_notifications")
    .select("id")
    .eq("kind", "growth_weekly_digest")
    .gte("created_at", weekStartUtc)
    .limit(1);
  if (error) return false;
  if ((existing ?? []).length > 0) return false;

  const currentWeek = rows.slice(0, 7);
  const previousWeek = rows.slice(7, 14);
  const currentWeekScore = avg(
    currentWeek.map((r) => r.feedback_avg_score).filter((v): v is number => typeof v === "number" && Number.isFinite(v)),
  );
  const prevWeekScore = avg(
    previousWeek.map((r) => r.feedback_avg_score).filter((v): v is number => typeof v === "number" && Number.isFinite(v)),
  );
  const currentWeekFeedback = currentWeek.reduce((sum, r) => sum + r.feedback_answers, 0);
  const prevWeekFeedback = previousWeek.reduce((sum, r) => sum + r.feedback_answers, 0);
  const currentWeekActifs = currentWeek.reduce((sum, r) => sum + r.active_users, 0);
  const prevWeekActifs = previousWeek.reduce((sum, r) => sum + r.active_users, 0);
  const inviteAttrWeek = currentWeek.reduce((sum, r) => sum + r.funnel_invite_attributions, 0);
  const feedbackEvtWeek = currentWeek.reduce((sum, r) => sum + r.funnel_feedback_submitted, 0);
  const surpriseRollsWeek = currentWeek.reduce((sum, r) => sum + r.funnel_surprise_graille_rolled, 0);
  const scoreDelta = currentWeekScore !== null && prevWeekScore !== null ? currentWeekScore - prevWeekScore : null;
  const feedbackDelta = currentWeekFeedback - prevWeekFeedback;
  const activeDelta = currentWeekActifs - prevWeekActifs;
  const riskLevel = classifyWeeklyRisk(scoreDelta, feedbackDelta, thresholds);

  const title =
    riskLevel === "critical"
      ? "Digest hebdo: risque critique satisfaction"
      : riskLevel === "attention"
        ? "Digest hebdo: recul satisfaction"
        : "Digest hebdo: synthèse croissance";
  const body = [
    `risque: ${riskLevel}`,
    `note S-0: ${currentWeekScore === null ? "-" : currentWeekScore.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/5`,
    `note S-1: ${prevWeekScore === null ? "-" : prevWeekScore.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/5`,
    `Δnote: ${scoreDelta === null ? "-" : scoreDelta.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `Δfeedback: ${feedbackDelta.toLocaleString("fr-FR")}`,
    `Δactifs: ${activeDelta.toLocaleString("fr-FR")}`,
    `inv.attr.S0: ${inviteAttrWeek}`,
    `fb.evts.S0: ${feedbackEvtWeek}`,
    `surprise.S0: ${surpriseRollsWeek}`,
  ].join(" · ");

  const recipients =
    riskLevel === "critical"
      ? uniqueIds([...alertUserIds, ...parseDecisionMakerUserIds()])
      : alertUserIds;
  if (recipients.length === 0) return false;

  await createInAppNotifications(
    recipients.map((userId) => ({
      userId,
      kind: "growth_weekly_digest",
      title,
      body,
      ctaHref: "/interne/croissance?jours=60",
      metadata: {
        digest_week_start: weekStartIso,
        current_week_score: currentWeekScore,
        previous_week_score: prevWeekScore,
        score_delta: scoreDelta,
        current_week_feedback: currentWeekFeedback,
        previous_week_feedback: prevWeekFeedback,
        feedback_delta: feedbackDelta,
        current_week_active_users: currentWeekActifs,
        previous_week_active_users: prevWeekActifs,
        active_users_delta: activeDelta,
        invite_attributions_week: inviteAttrWeek,
        feedback_events_week: feedbackEvtWeek,
        surprise_graille_rolled_week: surpriseRollsWeek,
        risk_level: riskLevel,
        recipients_count: recipients.length,
        thresholds,
      },
    })),
  );
  return true;
}
