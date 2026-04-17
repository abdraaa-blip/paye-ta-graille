"use client";

import { useEffect } from "react";
import Link from "next/link";
import { NightStageDecor } from "@/components/NightStageDecor";
import { trackGrowthEvent } from "@/lib/growth-events";

export function PartenairesClient() {
  useEffect(() => {
    void trackGrowthEvent({ event: "partners_page_view", context: "partenaires_page" });
  }, []);

  return (
    <>
      <section className="ptg-surface ptg-surface--static ptg-card ptg-partenaires-card">
        <h1 className="ptg-type-display ptg-partenaires-card__title">Partenaires restos & événements</h1>
        <div className="ptg-accent-rule ptg-partenaires-card__rule" />
        <p className="ptg-type-body ptg-partenaires-card__p">
          Paye ta graille construit des rencontres autour de vrais repas. On ouvre des collaborations locales: mise en avant
          de lieux fiables, offres limitées et soirées partenaires.
        </p>
        <p className="ptg-type-body ptg-partenaires-card__p ptg-partenaires-card__p--last">
          Monétisation envisagée (équilibrée): commission légère sur modules premium, packs visibilité restos, et formats
          événements co-organisés.
        </p>
        <div className="ptg-stack ptg-stack--compact">
          <a
            className="ptg-btn-primary"
            href="mailto:partenaires@paye-ta-graille.fr?subject=Partenariat%20Paye%20ta%20graille"
            onClick={() => void trackGrowthEvent({ event: "partners_cta_click", context: "partenaires_page", metadata: { cta: "mailto" } })}
          >
            Proposer un partenariat
          </a>
          <Link
            href="/graille-plus"
            className="ptg-btn-ghost ptg-partenaires-card__link-ghost"
            onClick={() => void trackGrowthEvent({ event: "partners_cta_click", context: "partenaires_page", metadata: { cta: "graille_plus" } })}
          >
            Voir Graille+
          </Link>
        </div>
      </section>
      <NightStageDecor />
    </>
  );
}
