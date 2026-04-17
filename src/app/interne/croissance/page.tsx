import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import {
  growthKpiAuthConfigured,
  isGrowthKpiAdminUser,
  parseGrowthKpiAdminUserIds,
} from "@/lib/growth-kpi-admin";
import {
  clampKpiDays,
  loadGrowthKpiDaily,
  partnersCtrPercent,
  partnersCtaTotal,
  type GrowthKpiDailyRow,
} from "@/lib/growth-kpi-data";
import { getGrowthKpiThresholds } from "@/lib/growth-kpi-thresholds";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Croissance (interne)",
  description: "Indicateurs produit agrégés, accès restreint.",
  robots: { index: false, follow: false },
};

function formatInt(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

function formatPct(n: number | null): string {
  if (n === null) return "-";
  return `${n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
}

function formatSigned(n: number, digits = 2): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toLocaleString("fr-FR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

function deltaTone(delta: number, warningThreshold: number) {
  if (delta <= warningThreshold) {
    return {
      label: "Attention",
      color: "var(--ptg-danger, #b42318)",
      bg: "color-mix(in srgb, var(--ptg-danger, #b42318) 10%, transparent)",
    };
  }
  if (delta > 0) {
    return {
      label: "En hausse",
      color: "var(--ptg-success, #067647)",
      bg: "color-mix(in srgb, var(--ptg-success, #067647) 10%, transparent)",
    };
  }
  return {
    label: "Stable",
    color: "var(--ptg-text, #1f1f1f)",
    bg: "color-mix(in srgb, var(--ptg-text, #1f1f1f) 7%, transparent)",
  };
}

function buildSparklinePoints(values: number[], width: number, height: number): string {
  if (values.length <= 1) return `0,${height / 2}`;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(0.0001, max - min);
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

type Props = { searchParams: Promise<{ jours?: string }> };

export default async function InterneCroissancePage({ searchParams }: Props) {
  if (!growthKpiAuthConfigured()) {
    notFound();
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isGrowthKpiAdminUser(user.id)) {
    notFound();
  }

  const sp = await searchParams;
  const days = clampKpiDays(sp.jours ?? undefined);
  const thresholds = getGrowthKpiThresholds();
  const result = await loadGrowthKpiDaily(days);

  let body: ReactNode;
  if (!result.ok) {
    body =
      result.reason === "no_service_role" ? (
        <p className="ptg-type-body" style={{ margin: 0 }}>
          Configure <code className="ptg-type-mono">SUPABASE_SERVICE_ROLE_KEY</code> sur le serveur pour afficher les
          agrégats.
        </p>
      ) : (
        <p className="ptg-type-body" style={{ margin: 0 }}>
          Lecture impossible : {result.detail ?? "erreur inconnue"}.
        </p>
      );
  } else {
    const rows = result.rows;
    const recent = rows.slice(0, 7);
    const previous = rows.slice(7, 14);
    const avgScoreRecent =
      recent.reduce((sum, r) => sum + (r.feedback_avg_score ?? 0), 0) / Math.max(1, recent.filter((r) => r.feedback_avg_score !== null).length);
    const avgScorePrev =
      previous.reduce((sum, r) => sum + (r.feedback_avg_score ?? 0), 0) /
      Math.max(1, previous.filter((r) => r.feedback_avg_score !== null).length);
    const feedbackCountRecent = recent.reduce((sum, r) => sum + r.feedback_answers, 0);
    const feedbackCountPrev = previous.reduce((sum, r) => sum + r.feedback_answers, 0);
    const feedbackScoreDelta = avgScoreRecent - avgScorePrev;
    const feedbackCountDelta = feedbackCountRecent - feedbackCountPrev;
    const scoreTone = deltaTone(feedbackScoreDelta, thresholds.feedbackDeltaWarn);
    const volumeTone = deltaTone(feedbackCountDelta, thresholds.feedbackVolumeWarn);
    const scoreSeries = [...rows]
      .reverse()
      .map((r) => r.feedback_avg_score)
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
    const baseline28Window = scoreSeries.slice(-28);
    const baseline28 =
      baseline28Window.length > 0
        ? baseline28Window.reduce((sum, v) => sum + v, 0) / baseline28Window.length
        : null;
    const current7Score = recent
      .map((r) => r.feedback_avg_score)
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
    const current7Avg = current7Score.length > 0 ? current7Score.reduce((sum, v) => sum + v, 0) / current7Score.length : null;
    const baselineGap = baseline28 !== null && current7Avg !== null ? current7Avg - baseline28 : null;
    const baselineTone = deltaTone(baselineGap ?? 0, thresholds.feedbackBaselineGapWarn);
    const feedbackTrendValues = [...rows]
      .reverse()
      .slice(-14)
      .map((r) => r.feedback_avg_score ?? 0);
    const sparklinePoints = buildSparklinePoints(feedbackTrendValues, 180, 44);

    body =
      rows.length === 0 ? (
        <p className="ptg-type-body" style={{ margin: 0 }}>
          Aucune donnée sur cette période. Les événements apparaissent après la première activité tracée.
        </p>
      ) : (
        <>
          <div className="ptg-grid ptg-grid-2" style={{ marginBottom: "0.9rem", gap: "0.6rem" }}>
            <div className="ptg-surface ptg-surface--static ptg-card ptg-card--compact">
              <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)", opacity: 0.85 }}>
                Delta note feedback (7j vs 7j précédents)
              </p>
              <p
                className="ptg-type-body"
                style={{
                  margin: "0.2rem 0 0",
                  fontSize: "var(--ptg-text-xs)",
                  fontWeight: 600,
                  color: scoreTone.color,
                  background: scoreTone.bg,
                  display: "inline-block",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "999px",
                }}
              >
                {scoreTone.label}
              </p>
              <p style={{ margin: "0.3rem 0 0", fontWeight: 700, fontSize: "var(--ptg-text-lg)" }}>
                {formatSigned(feedbackScoreDelta)} / 5
              </p>
            </div>
            <div className="ptg-surface ptg-surface--static ptg-card ptg-card--compact">
              <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)", opacity: 0.85 }}>
                Delta volume feedback (7j vs 7j précédents)
              </p>
              <p
                className="ptg-type-body"
                style={{
                  margin: "0.2rem 0 0",
                  fontSize: "var(--ptg-text-xs)",
                  fontWeight: 600,
                  color: volumeTone.color,
                  background: volumeTone.bg,
                  display: "inline-block",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "999px",
                }}
              >
                {volumeTone.label}
              </p>
              <p style={{ margin: "0.3rem 0 0", fontWeight: 700, fontSize: "var(--ptg-text-lg)" }}>
                {formatSigned(feedbackCountDelta, 0)}
              </p>
            </div>
            <div className="ptg-surface ptg-surface--static ptg-card ptg-card--compact">
              <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)", opacity: 0.85 }}>
                Tendance note feedback (14j)
              </p>
              <svg
                width="180"
                height="44"
                viewBox="0 0 180 44"
                role="img"
                aria-label="Tendance des notes feedback sur 14 jours"
                style={{ display: "block", marginTop: "0.45rem", overflow: "visible" }}
              >
                <polyline
                  points={sparklinePoints}
                  fill="none"
                  stroke="var(--ptg-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="ptg-surface ptg-surface--static ptg-card ptg-card--compact">
              <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)", opacity: 0.85 }}>
                Ecart vs baseline mobile 28j
              </p>
              <p
                className="ptg-type-body"
                style={{
                  margin: "0.2rem 0 0",
                  fontSize: "var(--ptg-text-xs)",
                  fontWeight: 600,
                  color: baselineTone.color,
                  background: baselineTone.bg,
                  display: "inline-block",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "999px",
                }}
              >
                {baselineTone.label}
              </p>
              <p style={{ margin: "0.3rem 0 0", fontWeight: 700, fontSize: "var(--ptg-text-lg)" }}>
                {baselineGap === null ? "-" : `${formatSigned(baselineGap)} / 5`}
              </p>
              <p className="ptg-type-body" style={{ margin: "0.2rem 0 0", fontSize: "var(--ptg-text-xs)", opacity: 0.8 }}>
                {baseline28 === null
                  ? "Baseline indisponible"
                  : `Baseline: ${baseline28.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / 5`}
              </p>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              className="ptg-type-body"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--ptg-border-subtle)" }}>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem 0.5rem 0" }}>
                    Jour
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }} title="Utilisateurs distincts (événements ce jour)">
                    Actifs
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }} title="Total événements enregistrés">
                    Évts
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }} title="Connexions réussies (OTP + lien magique)">
                    Auth+
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }} title="Chargements liste Découvrir">
                    Découv.
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }} title="Propositions de repas créées">
                    Repas
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }} title="Lieux soumis sur un repas">
                    Lieux
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }} title="Transitions de statut repas">
                    Δ repas
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }} title="Onboarding terminé">
                    Onb.
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }} title="Vues accueil app">
                    Acc.
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }}>
                    Partn. vues
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }}>
                    CTA
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }}>
                    CTR
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }} title="Nombre de réponses feedback reçues">
                    Feedback
                  </th>
                  <th scope="col" style={{ padding: "0.5rem 0.75rem" }} title="Score moyen feedback (1 à 5)">
                    Note moy.
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: GrowthKpiDailyRow) => (
                  <tr key={r.day} style={{ borderBottom: "1px solid var(--ptg-border-muted)" }}>
                    <td style={{ padding: "0.45rem 0.75rem 0.45rem 0", whiteSpace: "nowrap" }}>
                      {new Date(r.day + "T12:00:00.000Z").toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>{formatInt(r.active_users)}</td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>{formatInt(r.events_total)}</td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>{formatInt(r.funnel_auth_success)}</td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>{formatInt(r.funnel_discover_views)}</td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>{formatInt(r.funnel_meals_proposed)}</td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>{formatInt(r.funnel_meal_venues)}</td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>{formatInt(r.funnel_meal_status_updates)}</td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>{formatInt(r.funnel_onboarding_done)}</td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>{formatInt(r.funnel_accueil_views)}</td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>{formatInt(r.partners_page_views)}</td>
                    <td
                      style={{ padding: "0.45rem 0.75rem" }}
                      title={`mailto ${r.partners_cta_mailto} · Graille+ ${r.partners_cta_graille_plus}`}
                    >
                      {formatInt(partnersCtaTotal(r))}
                    </td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>{formatPct(partnersCtrPercent(r))}</td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>{formatInt(r.feedback_answers)}</td>
                    <td style={{ padding: "0.45rem 0.75rem" }}>
                      {r.feedback_avg_score === null
                        ? "-"
                        : r.feedback_avg_score.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
  }

  return (
    <div className="ptg-page">
      <div className="ptg-page-inner">
        <section className="ptg-surface ptg-surface--static ptg-card">
          <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
            Indicateurs croissance
          </h1>
          <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
          <p className="ptg-type-body" style={{ margin: "0 0 1rem", opacity: 0.9 }}>
            Agrégats journaliers (derniers {days} jours). Colonnes funnel : auth (OTP + lien magique), chargements Découvrir,
            repas proposés, lieux, changements de statut repas, onboarding terminé, vues accueil. CTR partenaires = (CTA) / vues
            page Partenaires. Feedback = réponses in-app et note moyenne (1 à 5).
          </p>
          <p className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "0.85rem", opacity: 0.85 }}>
            Période : ajoute <code className="ptg-type-mono">?jours=14</code> à l’URL (max 366). API JSON :{" "}
            <code className="ptg-type-mono">GET /api/growth/kpi?days=30</code> avec en-tête{" "}
            <code className="ptg-type-mono">x-ptg-growth-kpi-secret</code> ou session admin (
            {parseGrowthKpiAdminUserIds().length} compte(s) autorisé(s)).
          </p>
          <p className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "0.8rem", opacity: 0.8 }}>
            Profil seuil actif: <code className="ptg-type-mono">{thresholds.profile}</code> (delta note ≤{" "}
            <code className="ptg-type-mono">{thresholds.feedbackDeltaWarn}</code>, volume ≤{" "}
            <code className="ptg-type-mono">{thresholds.feedbackVolumeWarn}</code>, baseline gap ≤{" "}
            <code className="ptg-type-mono">{thresholds.feedbackBaselineGapWarn}</code>).
          </p>
          {body}
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
