"use client";

import { useLayoutEffect, useState } from "react";

function readReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Suit `prefers-reduced-motion` ; `useLayoutEffect` limite une frame « hors préférence » après navigation. */
export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(() => readReducedMotion());
  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}
