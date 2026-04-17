"use client";

import { HeroIllustrationBackdrop } from "@/components/HeroIllustrationBackdrop";

/**
 * Illustration « marque » en bas de page À propos : même cadre et effets que {@link NightStageDecor}
 * (`ptg-night-stage`, voile, survol, faisceaux, vapeur) ; seule la source raster reste `variant="brand"`.
 */
export function AboutBrandStageDecor() {
  return (
    <section className="ptg-night-stage" aria-hidden>
      <HeroIllustrationBackdrop
        variant="brand"
        priority={false}
        sizes="(max-width: 540px) 100vw, min(42rem, 92vw)"
      />
      <div className="ptg-night-stage__beam ptg-night-stage__beam--1" />
      <div className="ptg-night-stage__beam ptg-night-stage__beam--2" />
    </section>
  );
}
