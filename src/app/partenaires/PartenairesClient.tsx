"use client";

import { useEffect } from "react";
import Link from "next/link";
import { trackGrowthEvent } from "@/lib/growth-events";

export function PartenairesClient() {
  useEffect(() => {
    void trackGrowthEvent({ event: "partners_page_view", context: "partenaires_page" });
  }, []);

  return (
    <>
      <section className="ptg-surface ptg-surface--static ptg-card">
        <h1 className="ptg-type-display" style={{ margin: "0 0 0.6rem" }}>
          Partenaires restos & événements
        </h1>
        <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
        <p className="ptg-type-body" style={{ margin: "0 0 0.8rem" }}>
          Paye ta graille construit des rencontres autour de vrais repas. On ouvre des collaborations locales: mise en avant
          de lieux fiables, offres limitées et soirées partenaires.
        </p>
        <p className="ptg-type-body" style={{ margin: "0 0 1rem" }}>
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
            className="ptg-btn-ghost"
            style={{ textAlign: "center", textDecoration: "none" }}
            onClick={() => void trackGrowthEvent({ event: "partners_cta_click", context: "partenaires_page", metadata: { cta: "graille_plus" } })}
          >
            Voir Graille+
          </Link>
        </div>
      </section>
      <section className="ptg-night-stage" aria-hidden>
        <div className="ptg-night-stage__beam ptg-night-stage__beam--1" />
        <div className="ptg-night-stage__beam ptg-night-stage__beam--2" />
      </section>
    </>
  );
}
