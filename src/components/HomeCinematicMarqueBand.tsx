"use client";

import { gsap } from "gsap";
import { Montserrat } from "next/font/google";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cinematicAutoReplayIntervalSec, heroIllustrationEnabled } from "@/lib/env-public";
import { marketingCinematicTaglineLines } from "@/lib/marketing-copy";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { UX_HOME } from "@/lib/ux-copy";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800", "900"],
  display: "swap",
});

const WORDS = ["PAYE", "TA", "GRAILLE"] as const;

/** Même onglet : évite de relancer halage / balayage si l’utilisateur a choisi pause. */
const MOTION_PAUSE_SESSION_KEY = "ptg_home_cinematic_motion_pause";

/** Balayage type « imprimante » : premier passage après l’intro, puis intervalle long (pas 10–15 s). */
const PRINTER_FIRST_DELAY_SEC = 3.2;
const PRINTER_REPEAT_SEC = 88;

/** Accroches décoratives (`aria-hidden`) : cadence « frappe » (caractères / s). */
const CINEMATIC_TYPEWRITER_CPS = 21;

type CinematicTimeline = {
  progress: (value: number) => void;
  kill: () => void;
  pause: () => void;
  resume: () => void;
  paused: () => boolean;
};

function addTypewriterToTimeline(
  tl: gsap.core.Timeline,
  el: HTMLElement | null,
  fullText: string,
  charsPerSec: number,
  position: number | string,
): void {
  if (!el || !fullText) return;
  el.textContent = "";
  const dur = Math.max(0.42, fullText.length / charsPerSec);
  const state = { n: 0 };
  tl.to(
    state,
    {
      n: fullText.length,
      duration: dur,
      ease: "none",
      immediateRender: false,
      onUpdate: () => {
        el.textContent = fullText.slice(0, Math.round(state.n));
      },
      onComplete: () => {
        el.textContent = fullText;
      },
    },
    position,
  );
}

/**
 * Bande « signature » : intro GSAP (accroche au-dessus du logo, puis deux lignes sous l’accent),
 * pause/reprise, halage cadre, balayage léger périodique, rejouer — sans stroboscope.
 */
export function HomeCinematicMarqueBand() {
  const rootRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<CinematicTimeline | null>(null);
  const stackTlRef = useRef<CinematicTimeline | null>(null);
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const motionPausedRef = useRef(false);
  const [done, setDone] = useState(false);
  const [introKey, setIntroKey] = useState(0);
  const [motionPaused, setMotionPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const heroBand = heroIllustrationEnabled();
  const autoReplaySec = cinematicAutoReplayIntervalSec();
  const cinematicLines = marketingCinematicTaglineLines();
  const taglineAbove = cinematicLines[0] ?? "";
  const taglinesBelow = cinematicLines.slice(1, 3);
  const lineBelow0 = taglinesBelow[0] ?? "";
  const lineBelow1 = taglinesBelow[1] ?? "";
  const cinematicCopyKey = `${taglineAbove}\n${lineBelow0}\n${lineBelow1}`;
  const srTaglines = cinematicLines.join(" · ");
  const copyRef = useRef({ above: taglineAbove, b0: lineBelow0, b1: lineBelow1 });
  useEffect(() => {
    copyRef.current = { above: taglineAbove, b0: lineBelow0, b1: lineBelow1 };
  }, [taglineAbove, lineBelow0, lineBelow1]);

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(MOTION_PAUSE_SESSION_KEY) === "1") {
        motionPausedRef.current = true;
        setMotionPaused(true);
      }
    } catch {
      /* navigation privée */
    }
  }, []);

  useEffect(() => {
    motionPausedRef.current = motionPaused;
  }, [motionPaused]);

  const finish = useCallback(() => {
    stackTlRef.current?.kill();
    stackTlRef.current = null;
    timelineRef.current?.progress(1);
    timelineRef.current?.kill();
    timelineRef.current = null;
    ctxRef.current?.revert();
    ctxRef.current = null;

    const root = rootRef.current;
    const { above: tAbove, b0, b1 } = copyRef.current;
    if (root && typeof window !== "undefined") {
      const above = root.querySelector<HTMLElement>(".ptg-home-cinematic-band__tagline-above");
      const below = root.querySelectorAll<HTMLElement>(
        ".ptg-home-cinematic-band__taglines-below .ptg-home-cinematic-band__tagline-line",
      );
      if (above) above.textContent = tAbove;
      below.forEach((el, i) => {
        el.textContent = i === 0 ? b0 : b1;
      });
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const toClear = [above, ...below].filter(Boolean) as HTMLElement[];
        gsap.killTweensOf(toClear);
        if (above) gsap.set(above, { opacity: 1, x: 0, y: 0, rotateZ: 0, scale: 1 });
        for (const el of below) gsap.set(el, { opacity: 1, x: 0, y: 0, rotateZ: 0, scale: 1 });
      }
    }
    setDone(true);
  }, []);

  const toggleMotionPause = useCallback(() => {
    setMotionPaused((prev) => {
      const next = !prev;
      const tl = timelineRef.current;
      const st = stackTlRef.current;
      if (tl) {
        if (next) tl.pause();
        else tl.resume();
      }
      if (st) {
        if (next) st.pause();
        else st.resume();
      }
      try {
        if (next) sessionStorage.setItem(MOTION_PAUSE_SESSION_KEY, "1");
        else sessionStorage.removeItem(MOTION_PAUSE_SESSION_KEY);
      } catch {
        /* */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    if (motionPaused) {
      timelineRef.current?.pause();
      stackTlRef.current?.pause();
    } else {
      timelineRef.current?.resume();
      stackTlRef.current?.resume();
    }
  }, [motionPaused, introKey, reduceMotion]);

  const replayIntro = useCallback((opts?: { clearUserMotionPause?: boolean }) => {
    const clearUserMotionPause = opts?.clearUserMotionPause !== false;
    stackTlRef.current?.kill();
    stackTlRef.current = null;
    timelineRef.current?.kill();
    timelineRef.current = null;
    ctxRef.current?.revert();
    ctxRef.current = null;
    if (clearUserMotionPause) {
      try {
        sessionStorage.removeItem(MOTION_PAUSE_SESSION_KEY);
      } catch {
        /* */
      }
      motionPausedRef.current = false;
      setMotionPaused(false);
    }
    setDone(false);
    setIntroKey((k) => k + 1);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !heroBand) return;
    const root = rootRef.current;
    if (!root) return;

    /* Même source que le hook + garde-fou média : fige le texte et tue la timeline si la préférence change. */
    if (reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    const ctx = gsap.context(() => {
      const letters = root.querySelectorAll<HTMLElement>(".ptg-home-cinematic-band__letter");
      const aboveEl = root.querySelector<HTMLElement>(".ptg-home-cinematic-band__tagline-above");
      const below0 = root.querySelector<HTMLElement>(
        ".ptg-home-cinematic-band__taglines-below .ptg-home-cinematic-band__tagline-line:nth-of-type(1)",
      );
      const below1 = root.querySelector<HTMLElement>(
        ".ptg-home-cinematic-band__taglines-below .ptg-home-cinematic-band__tagline-line:nth-of-type(2)",
      );
      if (aboveEl) aboveEl.textContent = "";
      if (below0) below0.textContent = "";
      if (below1) below1.textContent = "";

      gsap.set(letters, { opacity: 0, y: 38, rotateZ: 0 });
      gsap.set(".ptg-home-cinematic-band__tagline-above", { opacity: 0, y: -16, x: 0, rotateZ: 0, scale: 1 });
      gsap.set(".ptg-home-cinematic-band__tagline-line", { opacity: 0, y: 16, x: 0, rotateZ: 0, scale: 1 });
      gsap.set(".ptg-home-cinematic-band__accent-line", { scaleX: 0, transformOrigin: "50% 50%" });
      gsap.set(".ptg-home-cinematic-band__backdrop", { opacity: 0 });
      gsap.set(".ptg-home-cinematic-band__printer-sheen", { clearProps: "all" });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setDone(true),
      });

      const cps = CINEMATIC_TYPEWRITER_CPS;

      tl.to(".ptg-home-cinematic-band__backdrop", { opacity: 1, duration: 0.58, ease: "power2.out" });
      tl.to(
        ".ptg-home-cinematic-band__tagline-above",
        { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" },
        ">-0.06",
      );
      addTypewriterToTimeline(tl, aboveEl, taglineAbove, cps, "<");
      tl.to(
        letters,
        {
          opacity: 1,
          y: 0,
          rotateZ: 0,
          duration: 0.92,
          ease: "back.out(1.18)",
          stagger: { each: 0.038, from: "start" },
        },
        ">-0.06",
      );
      tl.to(
        ".ptg-home-cinematic-band__accent-line",
        { scaleX: 1, duration: 0.52, ease: "power3.out" },
        "<0.2",
      );
      tl.to(
        ".ptg-home-cinematic-band__taglines-below .ptg-home-cinematic-band__tagline-line:nth-of-type(1)",
        { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" },
        "<0.14",
      );
      addTypewriterToTimeline(tl, below0, lineBelow0, cps, "<");
      tl.to(
        ".ptg-home-cinematic-band__letters",
        { scale: 1.012, duration: 0.44, ease: "sine.inOut", yoyo: true, repeat: 1 },
        ">-0.06",
      );

      timelineRef.current = tl;
    }, root);

    ctxRef.current = ctx;

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [introKey, heroBand, cinematicCopyKey, taglineAbove, lineBelow0, lineBelow1, reduceMotion, finish]);

  /** Dernière accroche sous le logo : montée douce, ligne du dessus à peine soulignée (pile lisible). */
  useEffect(() => {
    if (!done || reduceMotion || !heroBand) {
      stackTlRef.current?.kill();
      stackTlRef.current = null;
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(
      ".ptg-home-cinematic-band__taglines-below .ptg-home-cinematic-band__tagline-line",
    );
    if (els.length < 2) return;

    stackTlRef.current?.kill();
    const [l0, l1] = [els[0], els[1]];
    gsap.killTweensOf([l0, l1]);
    gsap.set(l0, { opacity: 1, y: 0, x: 0, rotateZ: 0, scale: 1 });
    gsap.set(l1, { opacity: 1, y: 0, x: 0, rotateZ: 0, scale: 1 });
    if (!lineBelow1.trim()) {
      l1.textContent = lineBelow1;
      stackTlRef.current = null;
      return;
    }
    l1.textContent = "";

    const stl = gsap.timeline({ defaults: { ease: "power2.out" } });
    addTypewriterToTimeline(stl, l1, lineBelow1, CINEMATIC_TYPEWRITER_CPS, 0.55);

    stackTlRef.current = stl;
    if (motionPausedRef.current) stl.pause();

    return () => {
      stl.kill();
      if (stackTlRef.current === stl) stackTlRef.current = null;
      gsap.killTweensOf([l0, l1]);
    };
  }, [done, reduceMotion, introKey, heroBand, lineBelow1]);

  /** Balayage léger périodique (pas de flash type stroboscope). */
  useEffect(() => {
    if (!heroBand || !done || motionPaused || reduceMotion) return;
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    const scheduled: gsap.core.Tween[] = [];

    const runPrinter = () => {
      if (cancelled || motionPausedRef.current) return;
      const sheen = root.querySelector<HTMLElement>(".ptg-home-cinematic-band__printer-sheen");
      if (!sheen) return;
      gsap.killTweensOf(sheen);
      gsap.fromTo(
        sheen,
        { xPercent: -72, opacity: 0 },
        {
          xPercent: 125,
          opacity: 0.18,
          duration: 2.05,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(sheen, { clearProps: "opacity,x,xPercent,transform" });
            if (!cancelled && !motionPausedRef.current) {
              const next = gsap.delayedCall(PRINTER_REPEAT_SEC, runPrinter);
              scheduled.push(next);
            }
          },
        },
      );
    };

    const first = gsap.delayedCall(PRINTER_FIRST_DELAY_SEC, runPrinter);
    scheduled.push(first);

    return () => {
      cancelled = true;
      for (const t of scheduled) t.kill();
      scheduled.length = 0;
      const sheen = root.querySelector<HTMLElement>(".ptg-home-cinematic-band__printer-sheen");
      if (sheen) gsap.killTweensOf(sheen);
    };
  }, [heroBand, done, motionPaused, reduceMotion, introKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !heroBand) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPrefChange = () => {
      if (mq.matches) finish();
    };
    mq.addEventListener("change", onPrefChange);
    return () => mq.removeEventListener("change", onPrefChange);
  }, [heroBand, finish]);

  /** Rejeu complet périodique (défaut 60 s) : uniquement si pas en pause, onglet visible, motion OK. */
  useEffect(() => {
    if (autoReplaySec == null || !heroBand || reduceMotion || motionPaused || !done) return;
    let timeoutId: ReturnType<typeof setTimeout>;

    const schedule = (delayMs: number) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(tick, delayMs);
    };

    const tick = () => {
      if (motionPausedRef.current) {
        schedule(5000);
        return;
      }
      if (document.visibilityState !== "visible") {
        schedule(4500);
        return;
      }
      replayIntro({ clearUserMotionPause: false });
    };

    schedule(autoReplaySec * 1000);

    const onVis = () => {
      if (document.visibilityState !== "visible") return;
      schedule(autoReplaySec * 1000);
    };

    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [autoReplaySec, heroBand, reduceMotion, motionPaused, done, introKey, replayIntro]);

  if (!heroBand) return null;

  const sectionClass = [
    "ptg-home-cinematic-band",
    montserrat.className,
    done ? "ptg-home-cinematic-band--done" : "",
    motionPaused ? "ptg-home-cinematic-band--motion-paused" : "",
    reduceMotion ? "ptg-home-cinematic-band--reduce-motion" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section ref={rootRef} className={sectionClass} aria-labelledby="home-cinematic-title">
      <h2 id="home-cinematic-title" className="ptg-visually-hidden">
        {UX_HOME.kicker}. {srTaglines}
      </h2>
      <div className="ptg-home-cinematic-band__border-sheen" aria-hidden />
      {!reduceMotion ? (
        <div
          className="ptg-home-cinematic-band__toolbar"
          role="toolbar"
          aria-label={UX_HOME.cinematicToolbarAria}
        >
          <div className="ptg-home-cinematic-band__toolbar-cluster ptg-home-cinematic-band__toolbar-cluster--playback">
            {!done ? (
              <button
                type="button"
                className="ptg-home-cinematic-band__tool-btn ptg-home-cinematic-band__tool-btn--playback"
                onClick={finish}
                aria-label={UX_HOME.cinematicSkip}
              >
                <span className="ptg-home-cinematic-band__btn-label ptg-home-cinematic-band__btn-label--full">
                  {UX_HOME.cinematicSkip}
                </span>
                <span className="ptg-home-cinematic-band__btn-label ptg-home-cinematic-band__btn-label--compact">
                  {UX_HOME.cinematicSkipShort}
                </span>
              </button>
            ) : (
              <button
                type="button"
                className="ptg-home-cinematic-band__tool-btn ptg-home-cinematic-band__tool-btn--playback"
                onClick={() => replayIntro()}
                aria-label={UX_HOME.cinematicReplay}
              >
                <span className="ptg-home-cinematic-band__btn-label ptg-home-cinematic-band__btn-label--full">
                  {UX_HOME.cinematicReplay}
                </span>
                <span className="ptg-home-cinematic-band__btn-label ptg-home-cinematic-band__btn-label--compact">
                  {UX_HOME.cinematicReplayShort}
                </span>
              </button>
            )}
          </div>
          <div className="ptg-home-cinematic-band__toolbar-cluster ptg-home-cinematic-band__toolbar-cluster--motion">
            <button
              type="button"
              className="ptg-home-cinematic-band__tool-btn ptg-home-cinematic-band__tool-btn--motion"
              onClick={toggleMotionPause}
              aria-pressed={motionPaused}
              aria-label={motionPaused ? UX_HOME.cinematicResume : UX_HOME.cinematicPause}
            >
              <span className="ptg-home-cinematic-band__btn-label ptg-home-cinematic-band__btn-label--full">
                {motionPaused ? UX_HOME.cinematicResume : UX_HOME.cinematicPause}
              </span>
              <span className="ptg-home-cinematic-band__btn-label ptg-home-cinematic-band__btn-label--compact">
                {motionPaused ? UX_HOME.cinematicResumeShort : UX_HOME.cinematicPauseShort}
              </span>
            </button>
          </div>
        </div>
      ) : null}
      <div className="ptg-home-cinematic-band__backdrop" aria-hidden />
      <div className="ptg-home-cinematic-band__mist" aria-hidden />
      <div className="ptg-home-cinematic-band__dust" aria-hidden />
      <div className="ptg-home-cinematic-band__inner">
        <div className="ptg-home-cinematic-band__stage">
          <p
            key={`cin-${introKey}-above`}
            className="ptg-home-cinematic-band__tagline-above"
            aria-hidden="true"
          >
            {taglineAbove}
          </p>
          <div className="ptg-home-cinematic-band__letters-clip">
            <div className="ptg-home-cinematic-band__letters" aria-hidden="true">
              {WORDS.map((word, wi) => (
                <div key={word} className="ptg-home-cinematic-band__word">
                  {word.split("").map((ch, li) => (
                    <span key={`${wi}-${li}`} className="ptg-home-cinematic-band__letter">
                      {ch}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="ptg-home-cinematic-band__printer-sheen" aria-hidden />
          </div>
          <div className="ptg-home-cinematic-band__accent-line" aria-hidden />
          <div className="ptg-home-cinematic-band__taglines-below" aria-hidden="true">
            {taglinesBelow.map((line, i) => (
              <p key={`cin-${introKey}-below-${i}`} className="ptg-home-cinematic-band__tagline-line">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
