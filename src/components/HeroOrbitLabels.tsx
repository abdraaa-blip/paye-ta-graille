"use client";

import { useEffect, useState } from "react";
import { HOME_HERO_ORBIT_LABELS, type HeroOrbitLabelsTuple } from "@/lib/hero-orbit-copy";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const POSITION_CLASS = [
  "ptg-hero-orbit--left-top",
  "ptg-hero-orbit--right-top",
  "ptg-hero-orbit--left-bottom",
  "ptg-hero-orbit--right-bottom",
] as const;

const DEFAULT_ROTATE_MS = 7200;

type Props = {
  /** Exactement 4 libellés (une pastille par coin). */
  labels?: HeroOrbitLabelsTuple;
  rotateIntervalMs?: number;
};

export function HeroOrbitLabels({ labels = HOME_HERO_ORBIT_LABELS, rotateIntervalMs = DEFAULT_ROTATE_MS }: Props = {}) {
  const reduceMotion = usePrefersReducedMotion();
  const [offset, setOffset] = useState(0);
  const n = labels.length;

  useEffect(() => {
    if (reduceMotion || n < 2) return;
    const id = window.setInterval(() => {
      setOffset((o) => (o + 1) % n);
    }, rotateIntervalMs);
    return () => window.clearInterval(id);
  }, [reduceMotion, n, rotateIntervalMs]);

  return (
    <div className="ptg-hero-orbits" aria-hidden>
      {POSITION_CLASS.map((pos, i) => (
        <span key={`${pos}-${offset}`} className={`ptg-hero-orbit ${pos}`}>
          {labels[(i + offset) % n]!}
        </span>
      ))}
    </div>
  );
}
