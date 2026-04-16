"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  ABOUT_BRAND_NAME,
  ABOUT_KICKER,
  ABOUT_LEAD,
  ABOUT_PILLARS,
  ABOUT_ROTATING_LINES,
} from "@/lib/about-copy";
import { UX_HOME } from "@/lib/ux-copy";
import { BrandScribbleBackdrop } from "@/components/BrandScribbleBackdrop";
import { HeroAtmosphere } from "@/components/HeroAtmosphere";
import { PtgLandingDecor } from "@/components/PtgLandingDecor";

const ROTATE_MS = 6000;

export function AProposClient() {
  const reduceMotion = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIdx((j) => (j + 1) % ABOUT_ROTATING_LINES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const line = ABOUT_ROTATING_LINES[idx] ?? ABOUT_ROTATING_LINES[0];

  return (
    <section className="ptg-hero-shell ptg-hero-shell--tall" aria-labelledby="apropos-title">
      <HeroAtmosphere />
      <BrandScribbleBackdrop />
      <PtgLandingDecor variant="full" />
      <div className="ptg-hero-stage">
        <div className="ptg-hero-orbits" aria-hidden>
          <span className="ptg-hero-orbit ptg-hero-orbit--left-top">à propos</span>
          <span className="ptg-hero-orbit ptg-hero-orbit--right-top">la marque</span>
          <span className="ptg-hero-orbit ptg-hero-orbit--left-bottom">table réelle</span>
          <span className="ptg-hero-orbit ptg-hero-orbit--right-bottom">sans promesse vide</span>
        </div>
        <div className="ptg-hero-card">
          <p className="ptg-kicker-pill ptg-kicker-pill--hero">{ABOUT_KICKER}</p>
          <div className="ptg-accent-rule ptg-accent-rule--hero" />
          <h1 id="apropos-title" className="ptg-type-display ptg-type-display--hero" style={{ margin: "0 0 0.65rem" }}>
            {ABOUT_BRAND_NAME}
          </h1>
          <p
            className="ptg-about-rotating"
            key={reduceMotion ? "static" : idx}
            role="status"
            aria-live={reduceMotion ? "off" : "polite"}
            style={{
              margin: "0 0 1rem",
              fontSize: "var(--ptg-text-lg)",
              fontWeight: 600,
              lineHeight: 1.4,
              color: "var(--ptg-text)",
              minHeight: "2.8em",
            }}
          >
            {line}
          </p>
          <p className="ptg-type-body" style={{ margin: "0 0 1rem", maxWidth: "none" }}>
            {ABOUT_LEAD}
          </p>
          <ul className="ptg-list-plain" style={{ margin: "0 0 1.25rem" }}>
            {ABOUT_PILLARS.map((p) => (
              <li key={p.title} className="ptg-surface ptg-surface--static ptg-card ptg-card--compact">
                <p className="ptg-card-title" style={{ fontSize: "var(--ptg-text-md-sm)", marginBottom: "0.35rem" }}>
                  {p.title}
                </p>
                <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-ui-sm)", maxWidth: "none" }}>
                  {p.body}
                </p>
              </li>
            ))}
          </ul>
          <div className="ptg-stack ptg-stack--roomy">
            <Link href="/commencer" className="ptg-btn-primary" style={{ textAlign: "center" }}>
              {UX_HOME.ctaPrimary}
            </Link>
            <Link href="/accueil" className="ptg-btn-secondary" style={{ textAlign: "center", textDecoration: "none" }}>
              Accueil
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
