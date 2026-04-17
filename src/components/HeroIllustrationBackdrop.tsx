"use client";

import Image from "next/image";
import { useState } from "react";
import {
  heroBrandDecorEnabled,
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
  /** Accueil : `hero`. Bandeaux sombres : `night`. Marque À propos : `brand` (`NEXT_PUBLIC_PTG_HERO_ART_BRAND` ou défaut `brand-marketplace.webp`). */
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

function rasterAllowed(variant: "hero" | "night" | "brand"): boolean {
  if (variant === "brand") return heroBrandDecorEnabled();
  return heroIllustrationEnabled();
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
  if (!rasterAllowed(variant) || loadFailed) return null;

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

  const rootClass = ["ptg-hero-illustration", variant === "brand" ? "ptg-hero-illustration--brand" : ""].filter(Boolean).join(" ");

  return (
    <div className={rootClass} aria-hidden>
      {mobile ? (
        <picture className="ptg-hero-illustration__picture">
          <source media={PICTURE_MOBILE_MQ} srcSet={mobile} />
          {img}
        </picture>
      ) : (
        img
      )}
      <div className="ptg-hero-illustration__veil" />
      <div className="ptg-hero-illustration__steam">
        <span className="ptg-hero-illustration__steam-wisp ptg-hero-illustration__steam-wisp--1" />
        <span className="ptg-hero-illustration__steam-wisp ptg-hero-illustration__steam-wisp--2" />
        <span className="ptg-hero-illustration__steam-wisp ptg-hero-illustration__steam-wisp--3" />
      </div>
    </div>
  );
}
