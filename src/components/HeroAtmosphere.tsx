/**
 * Fond émotionnel landing : lavis type papier aquarellé (CSS pur).
 * Inspiré d’une DA « cadre gourmand » — ne remplace pas des illustrations raster.
 */
export function HeroAtmosphere() {
  return (
    <div className="ptg-hero-atmosphere" aria-hidden>
      <div className="ptg-hero-atmosphere__wash ptg-hero-atmosphere__wash--nw" />
      <div className="ptg-hero-atmosphere__wash ptg-hero-atmosphere__wash--ne" />
      <div className="ptg-hero-atmosphere__wash ptg-hero-atmosphere__wash--sw" />
      <div className="ptg-hero-atmosphere__wash ptg-hero-atmosphere__wash--se" />
      <div className="ptg-hero-atmosphere__rim" />
    </div>
  );
}
