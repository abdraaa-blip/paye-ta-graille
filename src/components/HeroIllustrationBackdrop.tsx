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
const PICTURE_PORTRAIT_RAIL_MQ = "(max-width: 720px) and (orientation: portrait)";

export type HeroIllustrationBackdropProps = {
  /** Accueil : `hero`. Bandeaux sombres : `night`. Marque À propos : `brand` (`NEXT_PUBLIC_PTG_HERO_ART_BRAND` ou défaut `brand-marketplace.webp`). */
  variant?: "hero" | "night" | "brand";
  /** Accueil / LCP : true. Bandeaux secondaires : false (lazy, moins de concurrence réseau). */
  priority?: boolean;
  sizes?: string;
  /** Source principale optionnelle (ex. rotation côté composant parent). */
  overrideMainSrc?: string;
  /** Source mobile optionnelle ; `null` force une seule image. */
  overrideMobileSrc?: string | null;
  /**
   * Accueil uniquement : bannière large pour le rail mobile portrait (`<picture>` avant `NEXT_PUBLIC_PTG_HERO_ART_MOBILE`).
   * `null` / absent = pas de source dédiée (même image que desktop sur tout viewport).
   */
  portraitRailSrc?: string | null;
  /** Classe additionnelle sur la racine (`.ptg-hero-illustration`). */
  className?: string;
  /** Callback d'erreur image (en complément du fallback local). */
  onLoadError?: () => void;
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
 * Variantes `picture` : rail portrait accueil (`portraitRailSrc`), `NEXT_PUBLIC_PTG_HERO_ART_MOBILE` / `…_NIGHT_MOBILE` / `…_BRAND_MOBILE`.
 */
export function HeroIllustrationBackdrop({
  variant = "hero",
  priority = true,
  sizes = "100vw",
  overrideMainSrc,
  overrideMobileSrc,
  portraitRailSrc,
  className,
  onLoadError,
}: HeroIllustrationBackdropProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  if (!rasterAllowed(variant) || loadFailed) return null;

  const { main, mobile } = resolveSources(variant);
  const effectiveMain = overrideMainSrc ?? main;
  const effectiveMobile = overrideMobileSrc === undefined ? mobile : overrideMobileSrc;

  const img = (
    <Image
      src={effectiveMain}
      alt=""
      fill
      priority={priority}
      fetchPriority={priority ? "high" : "low"}
      sizes={sizes}
      quality={82}
      className="ptg-hero-illustration__img"
      onError={() => {
        setLoadFailed(true);
        onLoadError?.();
      }}
    />
  );

  const rootClass = ["ptg-hero-illustration", variant === "brand" ? "ptg-hero-illustration--brand" : "", className].filter(Boolean).join(" ");

  const rail =
    variant === "hero" && portraitRailSrc !== undefined && portraitRailSrc !== null && portraitRailSrc.trim().length > 0
      ? portraitRailSrc.trim()
      : null;

  const usePicture = Boolean(rail || effectiveMobile);

  return (
    <div className={rootClass} aria-hidden>
      {usePicture ? (
        <picture className="ptg-hero-illustration__picture">
          {rail ? <source media={PICTURE_PORTRAIT_RAIL_MQ} srcSet={rail} /> : null}
          {effectiveMobile ? <source media={PICTURE_MOBILE_MQ} srcSet={effectiveMobile} /> : null}
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
