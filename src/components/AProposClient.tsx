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
  ABOUT_SERVICE_LINKS,
  ABOUT_SERVICES_SECTION_INTRO,
  ABOUT_SERVICES_SECTION_TITLE,
} from "@/lib/about-copy";
import {
  ABOUT_LIVRET_SECTION_ID,
  ABOUT_SERVICES_SECTION_ID,
  livretHashWantsOpen,
  readLivretSession,
  scrollToAboutServices,
  servicesHashMatches,
  setLivretHashIfAllowed,
  stripOurLivretHash,
  writeLivretSession,
} from "@/lib/about-livret-session";
import { UX_HOME } from "@/lib/ux-copy";
import { BrandScribbleBackdrop } from "@/components/BrandScribbleBackdrop";
import { HeroAtmosphere } from "@/components/HeroAtmosphere";
import { HeroOrbitLabels } from "@/components/HeroOrbitLabels";
import { PtgLandingDecor } from "@/components/PtgLandingDecor";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const ROTATE_MS = 6000;

export function AProposClient() {
  const reduceMotion = usePrefersReducedMotion();
  const [lineIdx, setLineIdx] = useState(0);
  const [livretIdx, setLivretIdx] = useState(0);
  const [livretOpen, setLivretOpen] = useState(false);
  const [storageSynced, setStorageSynced] = useState(false);
  const livretRef = useRef<HTMLElement>(null);
  const savoirPlusRef = useRef<HTMLButtonElement>(null);
  const livretLabelId = useId();
  const servicesLabelId = useId();

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setLineIdx((j) => (j + 1) % ABOUT_ROTATING_LINES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  useEffect(() => {
    const hash = window.location.hash;
    const fromHashLivret = livretHashWantsOpen(hash);
    const fromHashServices = servicesHashMatches(hash);

    const saved = readLivretSession();
    let page = saved?.page ?? 0;
    if (page < 0 || page >= ABOUT_LIVRET_PAGES.length) page = 0;
    setLivretIdx(page);

    if (fromHashLivret) {
      setLivretOpen(true);
    } else if (fromHashServices) {
      setLivretOpen(false);
    } else if (saved && typeof saved.open === "boolean") {
      setLivretOpen(saved.open);
    }

    if (fromHashServices) {
      window.requestAnimationFrame(() => scrollToAboutServices());
    }

    setStorageSynced(true);
  }, []);

  useEffect(() => {
    const onHash = () => {
      setLivretOpen(livretHashWantsOpen(window.location.hash));
      if (servicesHashMatches(window.location.hash)) {
        window.requestAnimationFrame(() => scrollToAboutServices());
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!storageSynced) return;
    writeLivretSession({ open: livretOpen, page: livretIdx });
  }, [storageSynced, livretOpen, livretIdx]);

  useEffect(() => {
    if (!storageSynced) return;
    if (livretOpen) {
      setLivretHashIfAllowed();
    } else {
      stripOurLivretHash();
    }
  }, [storageSynced, livretOpen]);

  const line = ABOUT_ROTATING_LINES[lineIdx] ?? ABOUT_ROTATING_LINES[0];
  const page = ABOUT_LIVRET_PAGES[livretIdx] ?? ABOUT_LIVRET_PAGES[0];
  const last = ABOUT_LIVRET_PAGES.length - 1;

  const goLivretPrev = useCallback(() => {
    setLivretIdx((i) => Math.max(0, i - 1));
  }, []);

  const goLivretNext = useCallback(() => {
    setLivretIdx((i) => Math.min(last, i + 1));
  }, [last]);

  useEffect(() => {
    if (!livretOpen) return;
    const t = window.setTimeout(() => {
      document.getElementById(ABOUT_LIVRET_SECTION_ID)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      livretRef.current?.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(t);
  }, [livretOpen, reduceMotion]);

  useEffect(() => {
    if (!livretOpen) return;
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setLivretOpen(false);
      requestAnimationFrame(() => savoirPlusRef.current?.focus());
    };
    document.addEventListener("keydown", onDocKey);
    return () => document.removeEventListener("keydown", onDocKey);
  }, [livretOpen]);

  const toggleLivret = useCallback(() => {
    setLivretOpen((prev) => {
      if (prev) {
        requestAnimationFrame(() => savoirPlusRef.current?.focus());
      }
      return !prev;
    });
  }, []);

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
  }, [goLivretNext, goLivretPrev, livretOpen]);

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
            <button
              ref={savoirPlusRef}
              type="button"
              className="ptg-link-savoir-plus"
              onClick={toggleLivret}
              aria-expanded={livretOpen}
              aria-controls={ABOUT_LIVRET_SECTION_ID}
              aria-label={
                livretOpen
                  ? `Replier le livret ${ABOUT_BRAND_NAME}`
                  : `Ouvrir le livret : concept, intentions et vision de ${ABOUT_BRAND_NAME}`
              }
            >
              {livretOpen ? (
                <>
                  Replier le livret
                  <span aria-hidden>{" \u2191"}</span>
                </>
              ) : (
                <>
                  En savoir plus
                  <span aria-hidden>{" \u2193"}</span>
                </>
              )}
            </button>
            {!livretOpen ? (
              <p className="ptg-about-livret-teaser ptg-type-body">
                Le livret est replié : quelques pages pour comprendre le projet sans jargon. Tu peux aussi descendre directement à l’
                <Link href={`#${ABOUT_SERVICES_SECTION_ID}`} className="ptg-about-livret-teaser__link">
                  index « {ABOUT_SERVICES_SECTION_TITLE.toLowerCase()} »
                </Link>
                .
              </p>
            ) : null}
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

      {livretOpen ? (
        <section
          ref={livretRef}
          id={ABOUT_LIVRET_SECTION_ID}
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
            <p className="ptg-visually-hidden" aria-live="polite" aria-atomic="true">
              {page.title}. Page {livretIdx + 1} sur {ABOUT_LIVRET_PAGES.length}.
            </p>
            <div key={page.id} className="ptg-about-livret__sheet">
              {page.paragraphs.map((para, pi) => (
                <p key={`${page.id}-${pi}`}>{para}</p>
              ))}
            </div>
            <div className="ptg-about-livret__nav">
              <button type="button" className="ptg-btn-livret" onClick={goLivretPrev} disabled={livretIdx <= 0} aria-label="Page précédente">
                ← Tourner
              </button>
              <span className="ptg-about-livret__nav-meta" aria-hidden="true">
                {livretIdx + 1} sur {ABOUT_LIVRET_PAGES.length}
              </span>
              <button type="button" className="ptg-btn-livret" onClick={goLivretNext} disabled={livretIdx >= last} aria-label="Page suivante">
                Tourner →
              </button>
            </div>
            <p className="ptg-about-livret__hint">
              Astuce : sélectionne cette zone (Tab) puis utilise ← → pour tourner les pages. Échap replie le livret.
            </p>
            <p className="ptg-about-livret__to-services">
              <Link href={`#${ABOUT_SERVICES_SECTION_ID}`} className="ptg-about-livret__to-services-link">
                Index des pages du site
              </Link>
            </p>
          </div>
        </section>
      ) : null}

      <section id={ABOUT_SERVICES_SECTION_ID} className="ptg-about-services-wrap" aria-labelledby={servicesLabelId}>
        <h2 id={servicesLabelId} className="ptg-section-heading ptg-section-heading--signature" style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          {ABOUT_SERVICES_SECTION_TITLE}
        </h2>
        <p className="ptg-type-body ptg-about-services-intro">{ABOUT_SERVICES_SECTION_INTRO}</p>

        <div className="ptg-about-services-livret">
          <div className="ptg-about-livret__notch" aria-hidden />
          <ul className="ptg-about-services-grid ptg-list-plain">
            {ABOUT_SERVICE_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="ptg-about-service-link" prefetch={false}>
                  <span className="ptg-about-service-link__label">{item.label}</span>
                  <span className="ptg-about-service-link__blurb">{item.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
