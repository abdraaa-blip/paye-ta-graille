import type { Metadata } from "next";
import { AppNav } from "@/components/AppNav";
import { ModuleDisabledNotice } from "@/components/ModuleDisabledNotice";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { SiteFooter } from "@/components/SiteFooter";
import { moduleShareEnabled } from "@/lib/feature-modules";
import { GROWTH_MODULE_SHARE } from "@/lib/growth-copy";
import { PartageGrailleClient } from "./PartageGrailleClient";

export const metadata: Metadata = {
  title: "Partage de graille",
  description:
    "Proposer un repas fait maison dans un cadre encadré : allergies, participation ou don, rencontre locale.",
};

export default function PartageGraillePage() {
  if (!moduleShareEnabled()) {
    return (
      <div className="ptg-page">
        <PtgAppFlow>
          <div className="ptg-page-inner">
            <AppNav />
            <ModuleDisabledNotice title="Partage de graille" />
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
          <PtgMenuCard variant="apricot" stamp="Chez toi">
            <div className="ptg-page-head">
              <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
                {GROWTH_MODULE_SHARE.title}
              </h1>
              <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
              <p
                className="ptg-type-body"
                style={{
                  margin: "0 0 0.55rem",
                  fontSize: "var(--ptg-text-md-sm)",
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: "var(--ptg-accent-deep)",
                }}
              >
                {GROWTH_MODULE_SHARE.slogan}
              </p>
              <p className="ptg-type-body" style={{ margin: "0 0 0.65rem", lineHeight: 1.55, fontWeight: 600 }}>
                {GROWTH_MODULE_SHARE.oneLiner}
              </p>
              <p className="ptg-type-body" style={{ margin: "0 0 0", lineHeight: 1.55, fontSize: "var(--ptg-text-ui-sm)" }}>
                Repas fait chez toi. Tu dis ce qu’il y a dans l’assiette, sans jargon.
              </p>
            </div>
          </PtgMenuCard>

          <div className="ptg-banner ptg-banner-warn" style={{ marginBottom: "1rem", fontSize: "var(--ptg-text-ui-sm)" }}>
            <strong>Important.</strong> Les plats proposés ici sont préparés par des <strong>particuliers</strong>, pas par un
            restaurant professionnel soumis aux mêmes contrôles. Tu restes responsable de la sincérité des infos (ingrédients,
            allergies). Paye ta graille met en relation : elle ne remplace ni la réglementation sanitaire ni les obligations
            qui peuvent s’appliquer selon ton activité. En cas de doute, renseigne-toi auprès des autorités compétentes.
          </div>
          <p className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-sm)", lineHeight: 1.55 }}>
            Pour voir les offres, publier ou réserver : <strong>e-mail confirmé</strong>, <strong>pseudo</strong> et{" "}
            <strong>ville</strong> sur ton profil.
          </p>

          <PartageGrailleClient />
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
