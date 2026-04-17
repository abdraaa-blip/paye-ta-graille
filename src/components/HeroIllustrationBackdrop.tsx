"use client";

import Image from "next/image";
import { useState } from "react";
import { heroIllustrationEnabled, heroIllustrationSrc } from "@/lib/env-public";

/**
 * Illustration raster derrière les lavis (accueil). Défaut : WebP généré par `npm run optimize:hero`.
 * Lisibilité : carte hero + voile + lavis. Si l’asset échoue (404, CDN), la couche disparaît.
 */
export function HeroIllustrationBackdrop() {
  const [loadFailed, setLoadFailed] = useState(false);
  if (!heroIllustrationEnabled() || loadFailed) return null;
  const src = heroIllustrationSrc();

  return (
    <div className="ptg-hero-illustration" aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={82}
        className="ptg-hero-illustration__img"
        onError={() => setLoadFailed(true)}
      />
      <div className="ptg-hero-illustration__veil" />
    </div>
  );
}
