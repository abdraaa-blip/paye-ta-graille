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
    body =
      rows.length === 0 ? (
        <p className="ptg-type-body" style={{ margin: 0 }}>
          Aucune donnée sur cette période. Les événements apparaissent après la première activité tracée.
        </p>
      ) : (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            page Partenaires.
          </p>
          <p className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "0.85rem", opacity: 0.85 }}>
            Période : ajoute <code className="ptg-type-mono">?jours=14</code> à l’URL (max 366). API JSON :{" "}
            <code className="ptg-type-mono">GET /api/growth/kpi?days=30</code> avec en-tête{" "}
            <code className="ptg-type-mono">x-ptg-growth-kpi-secret</code> ou session admin (
            {parseGrowthKpiAdminUserIds().length} compte(s) autorisé(s)).
          </p>
          {body}
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
