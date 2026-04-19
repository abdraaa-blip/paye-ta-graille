"use client";

import { HeroIllustrationBackdrop } from "@/components/HeroIllustrationBackdrop";

/**
 * Bandeau décoratif bas de page : même illustration que l’accueil, traitement « nuit » + faisceaux.
 * `aria-hidden` : pur ornement (pages Partenaires, Expériences, etc.).
 */
export function NightStageDecor() {
  return (
    <section className="ptg-night-stage ptg-night-stage--peripheral" aria-hidden>
      <HeroIllustrationBackdrop
        variant="night"
        priority={false}
        sizes="(max-width: 540px) 100vw, min(42rem, 92vw)"
      />
      <div className="ptg-night-stage__beam ptg-night-stage__beam--1" />
      <div className="ptg-night-stage__beam ptg-night-stage__beam--2" />
    </section>
  );
}
