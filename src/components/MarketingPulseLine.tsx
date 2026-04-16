"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type Props = {
  lines: readonly string[];
  /** ms entre deux phrases */
  intervalMs?: number;
  className?: string;
  /** aria-live pour la landing : polite */
  live?: "off" | "polite";
};

export function MarketingPulseLine({
  lines,
  intervalMs = 6000,
  className = "ptg-marketing-pulse",
  live = "polite",
}: Props) {
  const reduceMotion = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (lines.length <= 1 || reduceMotion) return;
    const id = window.setInterval(() => {
      setIdx((j) => (j + 1) % lines.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [lines.length, intervalMs, reduceMotion]);

  const line = lines[idx] ?? lines[0];
  if (!line) return null;

  return (
    <p
      className={className}
      key={reduceMotion ? "static" : idx}
      role={live === "off" ? undefined : "status"}
      aria-live={live}
    >
      {line}
    </p>
  );
}
