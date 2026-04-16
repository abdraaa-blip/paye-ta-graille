"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  ABOUT_BRAND_NAME,
  ABOUT_HERO_ORBIT_LABELS,
  ABOUT_KICKER,
  ABOUT_LEAD,
  ABOUT_LIVRET_INTRO,
  ABOUT_LIVRET_PAGES,
  ABOUT_PILLARS,
  ABOUT_ROTATING_LINES,
} from "@/lib/about-copy";
import { UX_HOME } from "@/lib/ux-copy";
import { BrandScribbleBackdrop } from "@/components/BrandScribbleBackdrop";
import { HeroAtmosphere } from "@/components/HeroAtmosphere";
import { HeroOrbitLabels } from "@/components/HeroOrbitLabels";
import { PtgLandingDecor } from "@/components/PtgLandingDecor";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const ROTATE_MS = 6000;
const LIVRET_ID = "livret-payetagraille";

export function AProposClient() {
  const reduceMotion = usePrefersReducedMotion();
  const [lineIdx, setLineIdx] = useState(0);
  const [livretIdx, setLivretIdx] = useState(0);
  const livretRef = useRef<HTMLElement>(null);
  const livretLabelId = useId();

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setLineIdx((j) => (j + 1) % ABOUT_ROTATING_LINES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const line = ABOUT_ROTATING_LINES[lineIdx] ?? ABOUT_ROTATING_LINES[0];
  const page = ABOUT_LIVRET_PAGES[livretIdx] ?? ABOUT_LIVRET_PAGES[0];
  const last = ABOUT_LIVRET_PAGES.length - 1;

  const goLivretPrev = useCallback(() => {
    setLivretIdx((i) => Math.max(0, i - 1));
  }, []);

  const goLivretNext = useCallback(() => {
    setLivretIdx((i) => Math.min(last, i + 1));
  }, [last]);

  const scrollToLivret = useCallback(() => {
    document.getElementById(LIVRET_ID)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => livretRef.current?.focus({ preventScroll: true }), reduceMotion ? 0 : 380);
  }, [reduceMotion]);

  useEffect(() => {
    const el = livretRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      const a = document.activeElement;
      if (a !== el && !el.contains(a)) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goLivretNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goLivretPrev();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [goLivretNext, goLivretPrev]);

  return (
    <>
      <section className="ptg-hero-shell ptg-hero-shell--tall" aria-labelledby="apropos-title">
        <HeroAtmosphere />
        <BrandScribbleBackdrop />
        <PtgLandingDecor variant="full" />
        <div className="ptg-hero-stage">
          <HeroOrbitLabels labels={ABOUT_HERO_ORBIT_LABELS} rotateIntervalMs={7800} />
          <div className="ptg-hero-card">
            <p className="ptg-kicker-pill ptg-kicker-pill--hero">{ABOUT_KICKER}</p>
            <div className="ptg-accent-rule ptg-accent-rule--hero" />
            <h1 id="apropos-title" className="ptg-type-display ptg-type-display--hero" style={{ margin: "0 0 0.65rem" }}>
              {ABOUT_BRAND_NAME}
            </h1>
            <p
              className="ptg-about-rotating"
              key={reduceMotion ? "static" : lineIdx}
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
            <ul className="ptg-list-plain" style={{ margin: "0 0 1rem" }}>
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
            <button type="button" className="ptg-link-savoir-plus" onClick={scrollToLivret}>
              En savoir plus
              <span aria-hidden>{" \u2193"}</span>
            </button>
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

      <section
        ref={livretRef}
        id={LIVRET_ID}
        className="ptg-about-livret-wrap"
        tabIndex={0}
        role="region"
        aria-labelledby={livretLabelId}
      >
        <h2 id={livretLabelId} className="ptg-section-heading ptg-section-heading--signature" style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          Le livret
        </h2>
        <p className="ptg-type-body">{ABOUT_LIVRET_INTRO}</p>

        <div className="ptg-about-livret">
          <div className="ptg-about-livret__notch" aria-hidden />
          <h3 className="ptg-about-livret__heading">{page.title}</h3>
          <p className="ptg-about-livret__epigraph">{page.epigraph}</p>
          <hr className="ptg-about-livret__rule" />
          <div key={page.id} className="ptg-about-livret__sheet" role="status" aria-live="polite" aria-atomic="true">
            {page.paragraphs.map((para, pi) => (
              <p key={`${page.id}-${pi}`}>{para}</p>
            ))}
          </div>
          <div className="ptg-about-livret__nav">
            <button type="button" className="ptg-btn-livret" onClick={goLivretPrev} disabled={livretIdx <= 0} aria-label="Page précédente">
              ← Tourner
            </button>
            <span className="ptg-about-livret__nav-meta" aria-hidden>
              {livretIdx + 1} / {ABOUT_LIVRET_PAGES.length}
            </span>
            <button type="button" className="ptg-btn-livret" onClick={goLivretNext} disabled={livretIdx >= last} aria-label="Page suivante">
              Tourner →
            </button>
          </div>
          <p className="ptg-about-livret__hint">Astuce : sélectionne cette zone (Tab) puis utilise ← → pour tourner les pages.</p>
        </div>
      </section>
    </>
  );
}
