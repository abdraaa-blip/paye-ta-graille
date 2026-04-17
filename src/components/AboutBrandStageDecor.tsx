"use client";

import { useEffect, useMemo, useState } from "react";
import { HeroIllustrationBackdrop } from "@/components/HeroIllustrationBackdrop";
import { heroBrandIllustrationSrc } from "@/lib/env-public";

const BRAND_STAGE_ROTATE_MS_MOBILE = 4_500;
const BRAND_STAGE_ROTATE_MS_DESKTOP = 6_000;
const BRAND_STAGE_ROTATE_MS_MOBILE_COMPACT = 5_800;
const BRAND_STAGE_ROTATION_PATHS = [
  "/hero/brand-stage-campagne.webp",
  "/hero/brand-stage-manifeste.webp",
  "/hero/brand-stage-logo.webp",
];

function rotationKey(path: string): string {
  const clean = path.trim().toLowerCase().split("?")[0]?.split("#")[0] ?? "";
  return clean.replace(/\.(png|webp|jpe?g)$/i, "");
}

function uniqueVisualPaths(paths: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of paths) {
    const p = raw.trim();
    if (!p) continue;
    const key = rotationKey(p);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

/**
 * Illustration « marque » en bas de page À propos : même cadre et effets que {@link NightStageDecor}
 * (`ptg-night-stage`, voile, survol, faisceaux, vapeur) ; seule la source raster reste `variant="brand"`.
 */
export function AboutBrandStageDecor() {
  const [paused, setPaused] = useState(false);
  const [idx, setIdx] = useState(0);
  const [tick, setTick] = useState(0);
  const [rotateMs, setRotateMs] = useState(BRAND_STAGE_ROTATE_MS_DESKTOP);
  const [dropped, setDropped] = useState<Set<string>>(new Set());
  const pool = useMemo(
    () =>
      uniqueVisualPaths(BRAND_STAGE_ROTATION_PATHS).filter(
        (src) => !dropped.has(src),
      ),
    [dropped],
  );
  const active = pool[idx % Math.max(1, pool.length)] ?? heroBrandIllustrationSrc();

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 640px)");
    const mqCompact = window.matchMedia("(max-width: 390px)");
    const apply = () =>
      setRotateMs(
        mqCompact.matches
          ? BRAND_STAGE_ROTATE_MS_MOBILE_COMPACT
          : mqMobile.matches
            ? BRAND_STAGE_ROTATE_MS_MOBILE
            : BRAND_STAGE_ROTATE_MS_DESKTOP,
      );
    apply();
    mqMobile.addEventListener("change", apply);
    mqCompact.addEventListener("change", apply);
    return () => {
      mqMobile.removeEventListener("change", apply);
      mqCompact.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    if (paused || pool.length <= 1) return;
    const id = window.setInterval(() => {
      setIdx((prev) => {
        const next = prev + 1;
        return next % pool.length;
      });
      setTick((v) => v + 1);
    }, rotateMs);
    return () => window.clearInterval(id);
  }, [paused, pool.length, rotateMs]);

  useEffect(() => {
    if (idx < pool.length) return;
    setIdx(0);
  }, [idx, pool.length]);

  return (
    <section
      className="ptg-night-stage"
      aria-hidden
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <HeroIllustrationBackdrop
        variant="brand"
        priority={false}
        sizes="(max-width: 540px) 100vw, min(42rem, 92vw)"
        overrideMainSrc={active}
        overrideMobileSrc={null}
        className="ptg-about-brand-stage__backdrop"
        onLoadError={() => {
          setDropped((prev) => new Set(prev).add(active));
          setIdx((prev) => {
            if (pool.length <= 1) return 0;
            return (prev + 1) % pool.length;
          });
        }}
        key={`${active}-${tick}`}
      />
      <div className="ptg-night-stage__beam ptg-night-stage__beam--1" />
      <div className="ptg-night-stage__beam ptg-night-stage__beam--2" />
    </section>
  );
}
