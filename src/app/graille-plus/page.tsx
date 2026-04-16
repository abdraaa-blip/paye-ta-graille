import type { Metadata } from "next";
import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { MarketingPulseLine } from "@/components/MarketingPulseLine";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import {
  extensionsNavVisible,
  moduleFoodRescueEnabled,
  modulePaymentsEnabled,
  moduleShareEnabled,
} from "@/lib/feature-modules";
import { GROWTH_GRAILLE_PLUS_LEAD, GROWTH_MODULE_PAY, GROWTH_MODULE_RESCUE, GROWTH_MODULE_SHARE } from "@/lib/growth-copy";
import { MARKETING_GRAILLE_PLUS_PULSE_LINES } from "@/lib/marketing-copy";

export const metadata: Metadata = {
  title: "Graille+",
  description: "Partage culinaire, seconde graille et paiement sécurisé. Modules optionnels Paye ta graille.",
};

export default function GraillePlusPage() {
  const any = extensionsNavVisible();
  const share = moduleShareEnabled();
  const rescue = moduleFoodRescueEnabled();
  const pay = modulePaymentsEnabled();

  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
          <AppNav current="graille-plus" />
          <div className="ptg-page-head">
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              Graille+
            </h1>
            <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
            <MarketingPulseLine lines={MARKETING_GRAILLE_PLUS_PULSE_LINES} intervalMs={6900} className="ptg-accueil-pulse" />
            <p className="ptg-type-body" style={{ margin: "0 0 0", lineHeight: 1.55, fontWeight: 600 }}>
              {GROWTH_GRAILLE_PLUS_LEAD}
            </p>
            {any && (
              <p className="ptg-type-body" style={{ margin: "0.75rem 0 0", fontSize: "var(--ptg-text-sm)", lineHeight: 1.55 }}>
                Pour publier, réserver ou payer via ces modules : <strong>e-mail confirmé</strong>, <strong>pseudo</strong> et{" "}
                <strong>ville</strong> sur ton profil.
              </p>
            )}
          </div>

          {!any && (
            <p className="ptg-banner" style={{ marginBottom: "1.25rem" }}>
              Aucun module bonus n’est activé pour l’instant. Tu utilises la version classique, et c’est très bien comme
              ça.
            </p>
          )}

          <div className="ptg-stack ptg-stack--roomy">
            <section className="ptg-surface ptg-surface--static ptg-card">
              <h2 className="ptg-card-title" style={{ margin: "0 0 0.5rem" }}>
                Rencontres
              </h2>
              <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)" }}>
                Profils autour de toi, repas privés, intentions claires sur l’addition.
              </p>
              <Link href="/decouvrir" className="ptg-btn-primary" style={{ display: "inline-flex", fontSize: "var(--ptg-text-ui-sm)" }}>
                Voir les rencontres
              </Link>
            </section>

            <section className="ptg-surface ptg-surface--static ptg-card">
              <h2 className="ptg-card-title" style={{ margin: "0 0 0.5rem" }}>
                Événements
              </h2>
              <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)" }}>
                Expériences à rejoindre quand le module sera prêt.
              </p>
              <Link href="/experiences" className="ptg-btn-ghost" style={{ display: "inline-flex", fontSize: "var(--ptg-text-ui-sm)" }}>
                Événements
              </Link>
            </section>

            <section className="ptg-surface ptg-surface--static ptg-card" style={{ opacity: share ? 1 : 0.75 }}>
              <h2 className="ptg-card-title" style={{ margin: "0 0 0.5rem" }}>
                {GROWTH_MODULE_SHARE.title}
              </h2>
              <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)" }}>
                {GROWTH_MODULE_SHARE.oneLiner}
              </p>
              {share ? (
                <Link href="/partage-graille" className="ptg-btn-primary" style={{ display: "inline-flex", fontSize: "var(--ptg-text-ui-sm)" }}>
                  {GROWTH_MODULE_SHARE.cta}
                </Link>
              ) : (
                <span className="ptg-type-body" style={{ fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
                  Bientôt selon région / activation.
                </span>
              )}
            </section>

            <section className="ptg-surface ptg-surface--static ptg-card" style={{ opacity: rescue ? 1 : 0.75 }}>
              <h2 className="ptg-card-title" style={{ margin: "0 0 0.5rem" }}>
                {GROWTH_MODULE_RESCUE.title}
              </h2>
              <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)" }}>
                {GROWTH_MODULE_RESCUE.oneLiner}
              </p>
              {rescue ? (
                <Link href="/seconde-graille" className="ptg-btn-primary" style={{ display: "inline-flex", fontSize: "var(--ptg-text-ui-sm)" }}>
                  {GROWTH_MODULE_RESCUE.cta}
                </Link>
              ) : (
                <span className="ptg-type-body" style={{ fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
                  Bientôt selon région / activation.
                </span>
              )}
            </section>

            <section className="ptg-surface ptg-surface--static ptg-card" style={{ opacity: pay ? 1 : 0.75 }}>
              <h2 className="ptg-card-title" style={{ margin: "0 0 0.5rem" }}>
                {GROWTH_MODULE_PAY.title}
              </h2>
              <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)" }}>
                {GROWTH_MODULE_PAY.oneLiner}
              </p>
              <div
                role="group"
                aria-label="Choisir ton intention avant paiement"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(7.5rem, 1fr))",
                  gap: "0.45rem",
                  marginBottom: "0.75rem",
                }}
              >
                {(
                  [
                    { mood: "invite" as const, label: GROWTH_MODULE_PAY.chipInvite },
                    { mood: "split" as const, label: GROWTH_MODULE_PAY.chipSplit },
                    { mood: "guest" as const, label: GROWTH_MODULE_PAY.chipGuest },
                  ] as const
                ).map(({ mood, label }) =>
                  pay ? (
                    <Link
                      key={mood}
                      href={`/paiement-repas?mood=${mood}`}
                      className="ptg-filter-chip"
                      style={{
                        justifyContent: "center",
                        textAlign: "center",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        font: "inherit",
                      }}
                    >
                      {label}
                    </Link>
                  ) : (
                    <span
                      key={mood}
                      className="ptg-filter-chip"
                      style={{
                        justifyContent: "center",
                        cursor: "default",
                        opacity: 0.65,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
              {pay ? (
                <Link href="/paiement-repas" className="ptg-btn-primary" style={{ display: "inline-flex", fontSize: "var(--ptg-text-ui-sm)" }}>
                  {GROWTH_MODULE_PAY.cta}
                </Link>
              ) : (
                <span className="ptg-type-body" style={{ fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
                  Bientôt selon activation.
                </span>
              )}
            </section>
          </div>

          <p style={{ margin: "1.25rem 0 0" }}>
            <Link href="/accueil" className="ptg-link-back" style={{ marginBottom: 0 }}>
              ← Accueil
            </Link>
          </p>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
