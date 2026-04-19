import Image from "next/image";
import { heroHomeMarketAtmosphereSrc, heroIllustrationEnabled } from "@/lib/env-public";
import { UX_HOME } from "@/lib/ux-copy";

/** Dimensions source `landing-home-market-atmosphere.png` (aligné `optimize:hero`, ~3:2). */
const MARKET_IMG_WIDTH = 1024;
const MARKET_IMG_HEIGHT = 682;

/**
 * Scène illustrative **statique** sous la bande ciné (pas de carrousel — fluide, pro, pas de LCP ici).
 */
export function HomeMarketAtmosphereBand() {
  if (!heroIllustrationEnabled()) return null;

  return (
    <section className="ptg-home-market-band" aria-label={UX_HOME.marketAtmosphereAria}>
      <div className="ptg-home-market-band__frame">
        <Image
          src={heroHomeMarketAtmosphereSrc()}
          alt={UX_HOME.marketAtmosphereAlt}
          width={MARKET_IMG_WIDTH}
          height={MARKET_IMG_HEIGHT}
          sizes="(max-width: 720px) 100vw, min(72rem, 96vw)"
          className="ptg-home-market-band__img"
          quality={82}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}
