"use client";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/** Grille fixe (SSR-safe) : répétitions discrètes du nom de marque. */
const SCRIBBLES: { top: string; left: string; rotate: number; size: string; opacity: number }[] = [
  { top: "6%", left: "4%", rotate: -14, size: "0.68rem", opacity: 0.045 },
  { top: "12%", left: "78%", rotate: 8, size: "0.62rem", opacity: 0.04 },
  { top: "22%", left: "12%", rotate: 22, size: "0.75rem", opacity: 0.035 },
  { top: "18%", left: "52%", rotate: -6, size: "0.58rem", opacity: 0.05 },
  { top: "34%", left: "88%", rotate: -18, size: "0.7rem", opacity: 0.038 },
  { top: "41%", left: "6%", rotate: 11, size: "0.64rem", opacity: 0.042 },
  { top: "48%", left: "38%", rotate: -21, size: "0.55rem", opacity: 0.032 },
  { top: "55%", left: "72%", rotate: 15, size: "0.72rem", opacity: 0.036 },
  { top: "63%", left: "18%", rotate: -9, size: "0.6rem", opacity: 0.048 },
  { top: "71%", left: "55%", rotate: 19, size: "0.66rem", opacity: 0.034 },
  { top: "78%", left: "8%", rotate: -12, size: "0.59rem", opacity: 0.04 },
  { top: "85%", left: "42%", rotate: 7, size: "0.63rem", opacity: 0.038 },
  { top: "91%", left: "82%", rotate: -16, size: "0.57rem", opacity: 0.045 },
  { top: "3%", left: "44%", rotate: 25, size: "0.52rem", opacity: 0.03 },
  { top: "28%", left: "92%", rotate: -4, size: "0.68rem", opacity: 0.035 },
  { top: "52%", left: "28%", rotate: 13, size: "0.54rem", opacity: 0.042 },
  { top: "67%", left: "94%", rotate: -11, size: "0.61rem", opacity: 0.033 },
  { top: "8%", left: "62%", rotate: 17, size: "0.56rem", opacity: 0.046 },
  { top: "38%", left: "64%", rotate: -19, size: "0.65rem", opacity: 0.031 },
  { top: "74%", left: "34%", rotate: 6, size: "0.58rem", opacity: 0.039 },
];

type Props = {
  label?: string;
  className?: string;
  /** Landing avec illustration : marque un peu plus lisible (opacité rehaussée, plafonnée). */
  emphasis?: boolean;
};

const EMPHASIS_MULT = 1.62;
const EMPHASIS_OPACITY_CAP = 0.088;

export function BrandScribbleBackdrop({ label = "Paye ta graille", className, emphasis = false }: Props) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div
      className={["ptg-brand-scribbles", className].filter(Boolean).join(" ")}
      aria-hidden
    >
      {SCRIBBLES.map((s, i) => (
        <span
          key={i}
          className="ptg-brand-scribbles__item"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            opacity: (() => {
              const raw = s.opacity * (emphasis ? EMPHASIS_MULT : 1);
              const capped = emphasis ? Math.min(raw, EMPHASIS_OPACITY_CAP) : raw;
              if (reduceMotion) {
                return Math.min(capped * 0.85, emphasis ? 0.056 : 0.04);
              }
              return capped;
            })(),
            transform: `rotate(${s.rotate}deg)`,
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
