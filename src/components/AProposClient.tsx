"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type TouchEvent } from "react";
import {
  ABOUT_BRAND_NAME,
  ABOUT_HERO_ORBIT_LABELS,
  ABOUT_KICKER,
  ABOUT_LEAD,
  ABOUT_LIVRET_INTRO,
  ABOUT_LIVRET_PAGES,
  ABOUT_LIVRET_POSTER_ALT,
  ABOUT_PILLARS,
  ABOUT_ROTATING_LINES,
  ABOUT_SERVICE_LINKS,
  ABOUT_SERVICES_INDEX_COLLAPSE,
  ABOUT_SERVICES_INDEX_EXPAND,
  ABOUT_SERVICES_SECTION_INTRO,
  ABOUT_SERVICES_SECTION_TITLE,
} from "@/lib/about-copy";
import {
  ABOUT_LIVRET_SECTION_ID,
  ABOUT_SERVICES_INDEX_NARROW_MQ,
  ABOUT_SERVICES_SECTION_ID,
  livretHashWantsOpen,
  posterHashMatches,
  readLivretSession,
  scrollToAboutServices,
  servicesHashMatches,
  setLivretHashIfAllowed,
  stripOurLivretHash,
  writeLivretSession,
} from "@/lib/about-livret-session";
import { aboutLivretPosterLocalFallback, aboutLivretPosterSrc, heroBrandDecorEnabled } from "@/lib/env-public";
import { UX_HOME } from "@/lib/ux-copy";
import { AboutBrandStageDecor } from "@/components/AboutBrandStageDecor";
import { BrandScribbleBackdrop } from "@/components/BrandScribbleBackdrop";
import { HeroAtmosphere } from "@/components/HeroAtmosphere";
import { HeroOrbitLabels } from "@/components/HeroOrbitLabels";
import { PtgLandingDecor } from "@/components/PtgLandingDecor";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const ROTATE_MS = 6000;
/** Fermeture auto du détail pilier (souris ou focus), sauf logique « En savoir plus » / livret. */
const PILLAR_AUTO_CLOSE_MS = 15_000;
const LIVRET_SWIPE_MIN_X = 54;
const LIVRET_SWIPE_MAX_Y = 40;
const LIVRET_SWIPE_MAX_MS = 800;
const SWIPE_NUDGE_MS = 2200;
const SWIPE_NUDGE_SESSION_KEY = "ptg.about.livret.swipe-nudge.seen.v1";

function AboutLivretPosterImg() {
  const primary = aboutLivretPosterSrc();
  const [src, setSrc] = useState(primary);

  useEffect(() => {
    setSrc(primary);
  }, [primary]);

  return (
    // `img` natif : pas d’optimiseur `/_next/image` (évite 404 WebP si `optimize:hero` non lancé) + repli PNG local.
    // eslint-disable-next-line @next/next/no-img-element -- repli `onError` et URL `public/` fiables sans pipeline sharp
    <img
      src={src}
      alt={ABOUT_LIVRET_POSTER_ALT}
      width={572}
      height={1024}
      className="ptg-about-livret__poster-img"
      loading="lazy"
      decoding="async"
      onError={() => {
        const fb = aboutLivretPosterLocalFallback(src);
        if (fb && fb !== src) setSrc(fb);
      }}
    />
  );
}

type AboutLivretPosterButtonProps = {
  onOpen: () => void;
  ariaLabel?: string;
};

function AboutLivretPosterButton({ onOpen, ariaLabel = "Agrandir l’affiche" }: AboutLivretPosterButtonProps) {
  return (
    <button type="button" className="ptg-about-poster-open" onClick={onOpen} aria-label={ariaLabel}>
      <span className="ptg-about-poster-open__media" aria-hidden>
        <AboutLivretPosterImg />
      </span>
      <span className="ptg-about-poster-open__cta">Agrandir</span>
    </button>
  );
}

export function AProposClient() {
  const reduceMotion = usePrefersReducedMotion();
  const [lineIdx, setLineIdx] = useState(0);
  const [livretIdx, setLivretIdx] = useState(0);
  const [livretOpen, setLivretOpen] = useState(false);
  const [storageSynced, setStorageSynced] = useState(false);
  const [revealedPillar, setRevealedPillar] = useState<string | null>(null);
  const livretRef = useRef<HTMLElement>(null);
  const savoirPlusRef = useRef<HTMLButtonElement>(null);
  /** Identifiant `window.setTimeout` (nombre côté navigateur). */
  const pillarTimerRef = useRef<number | null>(null);
  const livretTouchStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const livretLabelId = useId();
  const servicesLabelId = useId();
  const servicesPanelId = useId();
  /** Index « Ce qu’on propose » : replié par défaut sur ≤720px ; sur grand écran toujours déplié (découvrabilité, pas de clic en plus). */
  const [servicesNarrow, setServicesNarrow] = useState(false);
  const [servicesIndexOpen, setServicesIndexOpen] = useState(false);
  const [posterLightboxOpen, setPosterLightboxOpen] = useState(false);
  const [showSwipeNudge, setShowSwipeNudge] = useState(false);
  const universPageIdx = Math.max(
    0,
    ABOUT_LIVRET_PAGES.findIndex((p) => p.id === "univers"),
  );

  const clearPillarTimer = useCallback(() => {
    if (pillarTimerRef.current) {
      clearTimeout(pillarTimerRef.current);
      pillarTimerRef.current = null;
    }
  }, []);

  const armPillarReveal = useCallback(
    (title: string) => {
      clearPillarTimer();
      setRevealedPillar(title);
      pillarTimerRef.current = window.setTimeout(() => {
        setRevealedPillar(null);
        pillarTimerRef.current = null;
        const ae = document.activeElement;
        if (ae instanceof HTMLElement && ae.classList.contains("ptg-about-pillar")) {
          ae.blur();
        }
      }, PILLAR_AUTO_CLOSE_MS);
    },
    [clearPillarTimer],
  );

  useEffect(() => () => clearPillarTimer(), [clearPillarTimer]);

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
    const fromHashPoster = posterHashMatches(hash);

    const saved = readLivretSession();
    let page = saved?.page ?? 0;
    if (page < 0 || page >= ABOUT_LIVRET_PAGES.length) page = 0;
    setLivretIdx(page);

    if (fromHashPoster) {
      setLivretIdx(universPageIdx);
      setLivretOpen(true);
    } else if (fromHashLivret) {
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
  }, [universPageIdx]);

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash;
      if (posterHashMatches(hash)) {
        setLivretIdx(universPageIdx);
        setLivretOpen(true);
        return;
      }
      setLivretOpen(livretHashWantsOpen(hash));
      if (servicesHashMatches(window.location.hash)) {
        setServicesIndexOpen(true);
        window.requestAnimationFrame(() => scrollToAboutServices());
      } else if (window.matchMedia(ABOUT_SERVICES_INDEX_NARROW_MQ).matches) {
        setServicesIndexOpen(false);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [universPageIdx]);

  useLayoutEffect(() => {
    const mq = window.matchMedia(ABOUT_SERVICES_INDEX_NARROW_MQ);
    const sync = () => {
      const narrow = mq.matches;
      setServicesNarrow(narrow);
      const wantsServices = servicesHashMatches(window.location.hash);
      if (!narrow || wantsServices) setServicesIndexOpen(true);
      else setServicesIndexOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
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

  const onLivretTouchStart = useCallback((e: TouchEvent<HTMLElement>) => {
    const t = e.changedTouches[0];
    if (!t) return;
    livretTouchStartRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  }, []);

  const onLivretTouchEnd = useCallback(
    (e: TouchEvent<HTMLElement>) => {
      const start = livretTouchStartRef.current;
      livretTouchStartRef.current = null;
      if (!start) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const dt = Date.now() - start.t;
      if (dt > LIVRET_SWIPE_MAX_MS) return;
      if (Math.abs(dy) > LIVRET_SWIPE_MAX_Y) return;
      if (Math.abs(dx) < LIVRET_SWIPE_MIN_X) return;
      if (dx < 0) goLivretNext();
      else goLivretPrev();
    },
    [goLivretNext, goLivretPrev],
  );

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

  useEffect(() => {
    if (!livretOpen || reduceMotion) return;
    if (typeof window === "undefined") return;
    const mobile = window.matchMedia("(max-width: 720px)").matches;
    if (!mobile) return;
    try {
      if (sessionStorage.getItem(SWIPE_NUDGE_SESSION_KEY) === "1") return;
      sessionStorage.setItem(SWIPE_NUDGE_SESSION_KEY, "1");
    } catch {
      /* sessionStorage indisponible (mode privé / quota) : on conserve un comportement dégradé sans bloquer l’UX. */
    }
    setShowSwipeNudge(true);
    const t = window.setTimeout(() => setShowSwipeNudge(false), SWIPE_NUDGE_MS);
    return () => window.clearTimeout(t);
  }, [livretOpen, reduceMotion]);

  const toggleLivret = useCallback(() => {
    setLivretOpen((prev) => {
      if (prev) {
        requestAnimationFrame(() => savoirPlusRef.current?.focus());
      }
      return !prev;
    });
  }, []);

  /** Kicker « Notre façon… » : ouvre le livret ou y ramène si déjà ouvert. */
  const openLivretFromKicker = useCallback(() => {
    if (livretOpen) {
      document.getElementById(ABOUT_LIVRET_SECTION_ID)?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      window.setTimeout(() => livretRef.current?.focus({ preventScroll: true }), reduceMotion ? 0 : 120);
      return;
    }
    setLivretOpen(true);
  }, [livretOpen, reduceMotion]);

  /** Teaser affiche depuis l’index : ouvre le livret directement sur la page visuelle. */
  const openPosterFromServices = useCallback(() => {
    setLivretIdx(universPageIdx);
    setLivretOpen(true);
  }, [universPageIdx]);
  const openPosterLightbox = useCallback(() => setPosterLightboxOpen(true), []);
  const closePosterLightbox = useCallback(() => setPosterLightboxOpen(false), []);

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

  useEffect(() => {
    if (!posterLightboxOpen) return;
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setPosterLightboxOpen(false);
    };
    document.addEventListener("keydown", onDocKey);
    return () => document.removeEventListener("keydown", onDocKey);
  }, [posterLightboxOpen]);

  return (
    <>
      <section className="ptg-hero-shell ptg-hero-shell--tall" aria-labelledby="apropos-title">
        <HeroAtmosphere />
        <BrandScribbleBackdrop />
        <PtgLandingDecor variant="full" />
        <div className="ptg-hero-stage">
          <HeroOrbitLabels labels={ABOUT_HERO_ORBIT_LABELS} rotateIntervalMs={7800} />
          <div className="ptg-hero-card">
            <Link
              href={`#${ABOUT_LIVRET_SECTION_ID}`}
              scroll={false}
              className="ptg-kicker-pill ptg-kicker-pill--hero ptg-kicker-pill--link"
              onClick={(e) => {
                e.preventDefault();
                openLivretFromKicker();
              }}
              aria-expanded={livretOpen}
              aria-controls={livretOpen ? ABOUT_LIVRET_SECTION_ID : undefined}
              title="Ouvre le livret du concept (même action qu’« En savoir plus »)"
            >
              {ABOUT_KICKER}
            </Link>
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
            <ul className="ptg-list-plain ptg-about-pillars" style={{ margin: "0 0 1rem" }}>
              {ABOUT_PILLARS.map((p) => (
                <li
                  key={p.title}
                  tabIndex={0}
                  className={[
                    "ptg-surface ptg-surface--static ptg-card ptg-card--compact ptg-about-pillar",
                    revealedPillar === p.title ? "ptg-about-pillar--revealed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onMouseEnter={() => armPillarReveal(p.title)}
                  onMouseLeave={() => {
                    clearPillarTimer();
                    setRevealedPillar(null);
                  }}
                  onFocus={() => armPillarReveal(p.title)}
                  onBlur={(e) => {
                    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
                    clearPillarTimer();
                    setRevealedPillar(null);
                  }}
                >
                  <p className="ptg-card-title" style={{ fontSize: "var(--ptg-text-md-sm)", marginBottom: "0.35rem" }}>
                    {p.title}
                  </p>
                  <p className="ptg-type-body ptg-about-pillar__lede" style={{ margin: 0, fontSize: "var(--ptg-text-ui-sm)", maxWidth: "none" }}>
                    {p.body}
                  </p>
                  <p className="ptg-type-body ptg-about-pillar__detail">{p.detail}</p>
                </li>
              ))}
            </ul>
            <button
              ref={savoirPlusRef}
              type="button"
              className="ptg-link-savoir-plus ptg-link-savoir-plus--about-cta"
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
            <button
              type="button"
              className="ptg-about-poster-quicklink"
              onClick={openPosterFromServices}
              aria-label="Ouvrir l’affiche dans le livret"
            >
              Voir l’affiche du projet
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

      {livretOpen ? (
        <section
          ref={livretRef}
          id={ABOUT_LIVRET_SECTION_ID}
          className="ptg-about-livret-wrap"
          tabIndex={0}
          role="region"
          aria-labelledby={livretLabelId}
          onTouchStart={onLivretTouchStart}
          onTouchEnd={onLivretTouchEnd}
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
            <div
              key={page.id}
              className={["ptg-about-livret__sheet", page.layout === "poster" ? "ptg-about-livret__sheet--poster" : ""]
                .filter(Boolean)
                .join(" ")}
            >
              {page.layout === "poster" ? (
                <div className="ptg-about-livret__poster">
                  <AboutLivretPosterButton onOpen={openPosterLightbox} ariaLabel="Agrandir l’affiche depuis le livret" />
                </div>
              ) : null}
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
            <p className={["ptg-about-livret__swipe-hint", showSwipeNudge ? "ptg-about-livret__swipe-hint--nudge" : ""].join(" ")} aria-hidden="true">
              ↔ Swipe pour tourner les pages
            </p>
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

        <button
          type="button"
          className="ptg-about-services-fold-btn ptg-link-savoir-plus ptg-link-savoir-plus--about-cta"
          aria-expanded={servicesIndexOpen}
          aria-controls={servicesPanelId}
          aria-label={
            servicesIndexOpen
              ? `Replier l’index : ${ABOUT_SERVICES_SECTION_TITLE.toLowerCase()}`
              : `Afficher l’index : ${ABOUT_SERVICES_SECTION_TITLE.toLowerCase()}`
          }
          onClick={() => setServicesIndexOpen((v) => !v)}
        >
          {servicesIndexOpen ? (
            <>
              {ABOUT_SERVICES_INDEX_COLLAPSE}
              <span aria-hidden>{" \u2191"}</span>
            </>
          ) : (
            <>
              {ABOUT_SERVICES_INDEX_EXPAND}
              <span aria-hidden>{" \u2193"}</span>
            </>
          )}
        </button>

        <div
          id={servicesPanelId}
          className={["ptg-about-services-panel", servicesIndexOpen ? "ptg-about-services-panel--open" : ""].filter(Boolean).join(" ")}
          role="region"
          aria-label={ABOUT_SERVICES_SECTION_TITLE}
        >
          <div className="ptg-about-services-panel__inner" inert={servicesNarrow && !servicesIndexOpen ? true : undefined}>
            <div className="ptg-about-services-livret">
              <div className="ptg-about-livret__notch" aria-hidden />
              <button
                type="button"
                className="ptg-about-services-poster-teaser"
                onClick={openPosterFromServices}
                aria-label="Ouvrir le livret à la page affiche « L’univers en une image »"
              >
                <span className="ptg-about-services-poster-teaser__media" aria-hidden>
                  <AboutLivretPosterImg />
                </span>
                <span className="ptg-about-services-poster-teaser__copy">
                  <span className="ptg-about-services-poster-teaser__title">L’univers en une image</span>
                  <span className="ptg-about-services-poster-teaser__blurb">
                    Voir l’affiche directement dans le livret.
                  </span>
                </span>
              </button>
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
          </div>
        </div>
      </section>

      {heroBrandDecorEnabled() ? (
        <div className="ptg-about-brand-stage-wrap">
          <AboutBrandStageDecor />
        </div>
      ) : null}
      {posterLightboxOpen ? (
        <div
          className="ptg-about-poster-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Affiche Paye ta graille en grand format"
          onClick={closePosterLightbox}
        >
          <div className="ptg-about-poster-lightbox__sheet" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="ptg-about-poster-lightbox__close" onClick={closePosterLightbox} aria-label="Fermer l’affiche">
              Fermer ×
            </button>
            <AboutLivretPosterImg />
          </div>
        </div>
      ) : null}
    </>
  );
}
