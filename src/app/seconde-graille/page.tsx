import type { Metadata } from "next";
import { AppNav } from "@/components/AppNav";
import { ModuleDisabledNotice } from "@/components/ModuleDisabledNotice";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { moduleFoodRescueEnabled } from "@/lib/feature-modules";
import { GROWTH_MODULE_RESCUE } from "@/lib/growth-copy";
import { SecondeGrailleClient } from "./SecondeGrailleClient";

export const metadata: Metadata = {
  title: "Seconde graille",
  description:
    "Surplus du jour près de chez toi : gratuit ou petit prix, sans culpabiliser, avec des limites pour éviter les abus.",
};

export default function SecondeGraillePage() {
  if (!moduleFoodRescueEnabled()) {
    return (
      <div className="ptg-page">
        <PtgAppFlow>
          <div className="ptg-page-inner">
            <AppNav />
            <ModuleDisabledNotice title="Seconde graille" />
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
              {GROWTH_MODULE_RESCUE.title}
            </h1>
            <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
            <p
              className="ptg-type-body"
              style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-md)", fontWeight: 600, color: "var(--ptg-text)" }}
            >
              {GROWTH_MODULE_RESCUE.oneLiner}
            </p>
            <p className="ptg-type-body" style={{ margin: "0 0 0", lineHeight: 1.55 }}>
            Ici, on parle du <strong>surplus du jour</strong> : ce qui peut encore faire plaisir à quelqu’un ce soir, sans
            jeter. <strong>Ce soir, quelqu’un peut en profiter</strong>, et c’est une bonne nouvelle pour tout le monde.
            </p>
          </div>

          <div className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.5rem", fontWeight: 700 }}>Créneau & confiance</p>
            <p className="ptg-type-body" style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-ui-sm)", lineHeight: 1.6 }}>
              Habituellement entre <strong>17h et 20h</strong>. Tu peux indiquer un créneau précis à la publication : les
              réservations ne seront possibles <strong>que pendant cette plage</strong>.
            </p>
            <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)", lineHeight: 1.55 }}>
              Pour voir, publier ou réserver : <strong>e-mail confirmé</strong>, <strong>pseudo</strong> et{" "}
              <strong>ville</strong> sur ton profil.
            </p>
          </div>

          <SecondeGrailleClient />
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
