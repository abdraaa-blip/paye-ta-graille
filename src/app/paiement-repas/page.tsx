import type { Metadata } from "next";
import { Suspense } from "react";
import { AppNav } from "@/components/AppNav";
import { ModuleDisabledNotice } from "@/components/ModuleDisabledNotice";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { modulePaymentsEnabled } from "@/lib/feature-modules";
import { GROWTH_MODULE_PAY } from "@/lib/growth-copy";
import { UX_LOADING } from "@/lib/ux-copy";
import { PaiementRepasClient } from "./PaiementRepasClient";

export const metadata: Metadata = {
  title: "Paiement du repas",
  description:
    "Sécuriser l’addition : invitation, moitié-moitié ou participation, via un prestataire de paiement, sans stocker les cartes.",
};

export default function PaiementRepasPage() {
  if (!modulePaymentsEnabled()) {
    return (
      <div className="ptg-page">
        <PtgAppFlow>
          <div className="ptg-page-inner">
            <AppNav />
            <ModuleDisabledNotice title="Paiement du repas" />
          </div>
        </PtgAppFlow>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
          <AppNav />
          <div className="ptg-page-head">
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              {GROWTH_MODULE_PAY.title}
            </h1>
            <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
            <p className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-ui-sm)", lineHeight: 1.55, fontWeight: 600 }}>
              Tu règles l’addition avec l’autre personne. Ici tu sécurises le geste (Stripe, sans stocker ta carte).{" "}
              <strong>E-mail confirmé</strong>, <strong>pseudo</strong> et <strong>ville</strong> requis sur le profil.
            </p>
          </div>

          <details className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
            <summary className="ptg-type-body" style={{ cursor: "pointer", fontWeight: 700, fontSize: "var(--ptg-text-sm)" }}>
              Détails : parcours cible, sécurité & conformité
            </summary>
            <div style={{ marginTop: "0.75rem" }}>
              <p style={{ margin: "0 0 0.5rem", fontWeight: 600, fontSize: "var(--ptg-text-ui-sm)" }}>Parcours (cible)</p>
              <ol className="ptg-type-body ptg-prose-list" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-ui-sm)" }}>
                <li>Paiement depuis le repas (montant ou part convenue).</li>
                <li>
                  Fonds chez un prestataire certifié (Stripe Checkout ; escrow / Connect selon le modèle validé avec ton
                  conseil).
                </li>
                <li>Libération après confirmation des participant·es (ou règle affichée).</li>
                <li>Versement hôte / lieu : cadre juridique & CGU à finaliser.</li>
              </ol>
              <p style={{ margin: "0 0 0.5rem", fontWeight: 600, fontSize: "var(--ptg-text-ui-sm)" }}>Sécurité</p>
              <ul className="ptg-type-body ptg-prose-list" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-ui-sm)" }}>
                <li>Pas de carte stockée chez nous. PCI-DSS côté Stripe.</li>
                <li>Journal des transactions pour support / litiges.</li>
                <li>Commission éventuelle : affichée avant paiement.</li>
              </ul>
              <p className="ptg-banner ptg-banner-warn" style={{ margin: 0, fontSize: "var(--ptg-text-ui-sm)" }}>
                <strong>Conformité.</strong> Statut réglementaire (intermédiaire, marketplace…) à trancher avec un conseil.
                Webhook : URL publique + <code style={{ fontSize: "0.8em" }}>STRIPE_WEBHOOK_SECRET</code> + service role pour
                le journal.
              </p>
            </div>
          </details>

          <Suspense fallback={<p className="ptg-type-body">{UX_LOADING}</p>}>
            <PaiementRepasClient />
          </Suspense>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
