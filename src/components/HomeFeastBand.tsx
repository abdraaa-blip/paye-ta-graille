import Image from "next/image";
import { heroHomeFeastBandSrc, heroIllustrationEnabled } from "@/lib/env-public";
import { UX_HOME } from "@/lib/ux-copy";

/** Dimensions source `landing-home-feast.png` (aligné `optimize:hero`, ratio ~3:2). */
const FEAST_IMG_WIDTH = 1024;
const FEAST_IMG_HEIGHT = 682;

/**
 * Bande visuelle statique sous le hero accueil : scène « table partagée » (pas de carrousel — LCP & clarté).
 */
export function HomeFeastBand() {
  if (!heroIllustrationEnabled()) return null;

  return (
    <section className="ptg-home-feast-band" aria-label="Illustration d’une table partagée">
      <div className="ptg-home-feast-band__frame">
        <Image
          src={heroHomeFeastBandSrc()}
          alt={UX_HOME.feastBandAlt}
          width={FEAST_IMG_WIDTH}
          height={FEAST_IMG_HEIGHT}
          sizes="(max-width: 720px) 100vw, min(72rem, 96vw)"
          className="ptg-home-feast-band__img"
          quality={82}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}
