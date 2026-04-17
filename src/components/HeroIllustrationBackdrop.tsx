"use client";

import Image from "next/image";
import { useState } from "react";
import {
  heroBrandIllustrationMobileSrc,
  heroBrandIllustrationSrc,
  heroIllustrationEnabled,
  heroIllustrationMobileSrc,
  heroIllustrationSrc,
  heroNightIllustrationMobileSrc,
  heroNightIllustrationSrc,
} from "@/lib/env-public";

const PICTURE_MOBILE_MQ = "(max-width: 639px)";

export type HeroIllustrationBackdropProps = {
  /** Accueil : `hero`. Bandeaux sombres : `night`. Fond « marque » riche : `brand` (`NEXT_PUBLIC_PTG_HERO_ART_BRAND` ou défaut marketplace). */
  variant?: "hero" | "night" | "brand";
  /** Accueil / LCP : true. Bandeaux secondaires : false (lazy, moins de concurrence réseau). */
  priority?: boolean;
  sizes?: string;
};

function resolveSources(variant: "hero" | "night" | "brand"): { main: string; mobile: string | null } {
  if (variant === "night") {
    return { main: heroNightIllustrationSrc(), mobile: heroNightIllustrationMobileSrc() };
  }
  if (variant === "brand") {
    return { main: heroBrandIllustrationSrc(), mobile: heroBrandIllustrationMobileSrc() };
  }
  return { main: heroIllustrationSrc(), mobile: heroIllustrationMobileSrc() };
}

/**
 * Illustration raster derrière les lavis (accueil). Défaut : WebP généré par `npm run optimize:hero`.
 * Variantes `picture` optionnelles via `NEXT_PUBLIC_PTG_HERO_ART_MOBILE` / `…_NIGHT_MOBILE` / `…_BRAND_MOBILE`.
 */
export function HeroIllustrationBackdrop({
  variant = "hero",
  priority = true,
  sizes = "100vw",
}: HeroIllustrationBackdropProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  if (!heroIllustrationEnabled() || loadFailed) return null;

  const { main, mobile } = resolveSources(variant);

  const img = (
    <Image
      src={main}
      alt=""
      fill
      priority={priority}
      fetchPriority={priority ? "high" : "low"}
      sizes={sizes}
      quality={82}
      className="ptg-hero-illustration__img"
      onError={() => setLoadFailed(true)}
    />
  );

  return (
    <div className="ptg-hero-illustration" aria-hidden>
      {mobile ? (
        <picture className="ptg-hero-illustration__picture">
          <source media={PICTURE_MOBILE_MQ} srcSet={mobile} />
          {img}
        </picture>
      ) : (
        img
      )}
      <div className="ptg-hero-illustration__veil" />
    </div>
  );
}
