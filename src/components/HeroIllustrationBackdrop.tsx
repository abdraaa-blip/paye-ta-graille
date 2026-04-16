"use client";

import Image from "next/image";
import { useState } from "react";
import { heroIllustrationEnabled, heroIllustrationSrc } from "@/lib/env-public";

/**
 * Couche illustrative derrière les lavis CSS (landing). Source par défaut : WebP (`optimize:hero`).
 * Lisibilité : `.ptg-hero-card` + voile CSS + lavis. Si l’asset est introuvable (404, CDN), la couche disparaît.
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
        sizes="100vw"
        quality={82}
        className="ptg-hero-illustration__img"
        onError={() => setLoadFailed(true)}
      />
      <div className="ptg-hero-illustration__veil" />
    </div>
  );
}
