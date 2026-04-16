import type { ReactNode } from "react";

/**
 * Encart « carte de restaurant » : même famille visuelle que le livret À propos,
 * avec variantes de couleur / tampon pour différencier les parcours sans refaire une DA par page.
 */
/** `kin` = compagnons / lien après table (distinct de `sage`, surplus & calme). */
export const PTG_MENU_CARD_VARIANTS = ["ember", "apricot", "sage", "kin", "ledger", "spark", "mist", "pin"] as const;
export type PtgMenuCardVariant = (typeof PTG_MENU_CARD_VARIANTS)[number];

const GLYPH_SVG_PROPS = {
  className: "ptg-menu-card__glyph",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true as const,
  focusable: false as const,
};

/** Motif discret en coin : une forme par variante (stroke, couleur = --ptg-menu-ornament). */
function PtgMenuCardGlyph({ variant }: { variant: PtgMenuCardVariant }) {
  const stroke = "currentColor";
  const sw = 1.55;
  switch (variant) {
    case "ember":
      return (
        <svg {...GLYPH_SVG_PROPS}>
          <path
            d="M12 21a5 5 0 0 1-2.1-9.5C9.2 9 9.5 6.5 12 3c2.6 3.6 2.8 6 2.1 8.5A5 5 0 0 1 12 21z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "apricot":
      return (
        <svg {...GLYPH_SVG_PROPS}>
          <path
            d="M5.5 10.5 12 5.2l6.5 5.3V18a1.1 1.1 0 0 1-1.1 1.1H6.6A1.1 1.1 0 0 1 5.5 18v-7.5Z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path d="M10.2 19.1v-5.4h3.6v5.4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "sage":
      return (
        <svg {...GLYPH_SVG_PROPS}>
          <path
            d="M12 20.5C8 15.5 7.5 10.5 12 3.5c4.5 7 4 12 0 17z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path d="M12 8.5v8" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case "ledger":
      return (
        <svg {...GLYPH_SVG_PROPS}>
          <path d="M6.5 7h11M6.5 10.8h11M6.5 14.6h7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M5.8 5.2h12.4v13.6H5.8V5.2z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    case "spark":
      return (
        <svg {...GLYPH_SVG_PROPS}>
          <path
            d="M12 4v3.2M12 16.8V20M5.2 12h3.2M15.6 12h3.2M7.4 7.4l2.3 2.3M14.3 14.3l2.3 2.3M16.6 7.4l-2.3 2.3M9.7 14.3l-2.3 2.3"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
    case "kin":
      return (
        <svg {...GLYPH_SVG_PROPS}>
          <circle cx="8.2" cy="12" r="2.65" stroke={stroke} strokeWidth={sw} />
          <circle cx="15.8" cy="12" r="2.65" stroke={stroke} strokeWidth={sw} />
          <path d="M10.85 12h2.3" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case "mist":
      return (
        <svg {...GLYPH_SVG_PROPS}>
          <path d="M2 15.5 Q8 13.2 14 15.5 T22 15.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path
            d="M2 10.8 Q7.5 8.9 13 10.8 T22 10.8"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            opacity={0.72}
          />
        </svg>
      );
    case "pin":
      return (
        <svg {...GLYPH_SVG_PROPS}>
          <path
            d="M12 20.8s5.4-4.8 5.4-9.6a5.4 5.4 0 1 0-10.8 0c0 4.8 5.4 9.6 5.4 9.6Z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <circle cx="12" cy="11.2" r="2.05" stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    default:
      return null;
  }
}

type Props = {
  variant: PtgMenuCardVariant;
  children: ReactNode;
  /** Petit tampon façon menu (ex. « Du jour »). */
  stamp?: string;
  className?: string;
  /** Affiche le glyphe décoratif (défaut : true). */
  showGlyph?: boolean;
};

export function PtgMenuCard({ variant, children, stamp, className = "", showGlyph = true }: Props) {
  const v = PTG_MENU_CARD_VARIANTS.includes(variant) ? variant : "ember";
  return (
    <div className={`ptg-menu-card ptg-menu-card--${v} ${className}`.trim()}>
      {stamp ? (
        <p className="ptg-menu-card__stamp">
          <span className="ptg-menu-card__stamp-inner">{stamp}</span>
        </p>
      ) : null}
      <span className="ptg-menu-card__ornament ptg-menu-card__ornament--tl" aria-hidden />
      <span className="ptg-menu-card__ornament ptg-menu-card__ornament--br" aria-hidden />
      <div className="ptg-menu-card__notch" aria-hidden />
      <div className="ptg-menu-card__body">
        {showGlyph ? <PtgMenuCardGlyph variant={v} /> : null}
        {children}
      </div>
    </div>
  );
}
