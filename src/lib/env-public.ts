/**
 * Variables publiques attendues par l'app (sans secrets).
 * URLs `http(s)://` pour images : `config/public-hero-image-url-env-keys.json` + `public-hero-image-url-env-keys.ts`.
 */
// Parser rejouage bande ciné : `scripts/lib/cinematic-auto-replay-interval.mjs` + tests `scripts/__tests__/cinematic-auto-replay-interval.test.mjs`
import { parseCinematicAutoReplayIntervalSec } from "../../scripts/lib/cinematic-auto-replay-interval.mjs";

export { PUBLIC_HERO_IMAGE_URL_ENV_KEYS } from "./public-hero-image-url-env-keys";

const NEGATIVE_FLAGS = new Set(["0", "false", "off", "no"]);

function isNegativePublicFlag(v: string | undefined): boolean {
  const t = v?.trim().toLowerCase();
  return Boolean(t && NEGATIVE_FLAGS.has(t));
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url?.trim() && key?.trim());
}

/**
 * Fond illustré raster sur l’accueil et variantes `hero` / `night` du composant d’illustration.
 * Désactiver : `NEXT_PUBLIC_PTG_HERO_ILLUSTRATION=0`. Ne contrôle pas le cadre « marque » À propos (`heroBrandDecorEnabled`).
 */
export function heroIllustrationEnabled(): boolean {
  return !isNegativePublicFlag(process.env.NEXT_PUBLIC_PTG_HERO_ILLUSTRATION);
}

/**
 * Cadre illustration marque en bas de page À propos. Indépendant de `NEXT_PUBLIC_PTG_HERO_ILLUSTRATION`.
 * Désactiver uniquement ce bloc : `NEXT_PUBLIC_PTG_HERO_BRAND_DECOR=0`.
 */
export function heroBrandDecorEnabled(): boolean {
  return !isNegativePublicFlag(process.env.NEXT_PUBLIC_PTG_HERO_BRAND_DECOR);
}

/** WebP hero versionné dans `public/hero/` (généré par `npm run optimize:hero`). */
export const DEFAULT_HERO_WEBP_PATH = "/hero/landing-watercolor.webp" as const;
/** Bannière accueil mobile portrait (rail haut ≤720px) ; desktop = `DEFAULT_HERO_WEBP_PATH`. */
export const DEFAULT_HERO_PORTRAIT_RAIL_WEBP_PATH = "/hero/landing-watercolor-portrait-rail.webp" as const;
/** Illustration « marque » page À propos : défaut `brand-marketplace.webp` (voir `optimize:hero`). */
export const DEFAULT_HERO_BRAND_WEBP_PATH = "/hero/brand-marketplace.webp" as const;

/**
 * Chemin sous `public/` ou URL `http(s)://…` (host autorisé au build via `next.config.ts`).
 * Défaut : `DEFAULT_HERO_WEBP_PATH`.
 */
export function heroIllustrationSrc(): string {
  const custom = process.env.NEXT_PUBLIC_PTG_HERO_ART?.trim();
  if (custom) return custom;
  return DEFAULT_HERO_WEBP_PATH;
}

/**
 * Illustration bandeau « nuit » (Partenaires, Expériences…). Recadrage / tons plus sombres si besoin.
 * Absent = même fichier que `heroIllustrationSrc()`.
 */
export function heroNightIllustrationSrc(): string {
  const night = process.env.NEXT_PUBLIC_PTG_HERO_ART_NIGHT?.trim();
  if (night) return night;
  return heroIllustrationSrc();
}

/**
 * Fond illustré « marque » (composition À propos). Défaut : `brand-marketplace.webp`.
 * Surcharge : `NEXT_PUBLIC_PTG_HERO_ART_BRAND` (ex. `/hero/brand-poster.webp` si tu veux l’affiche).
 */
export function heroBrandIllustrationSrc(): string {
  const custom = process.env.NEXT_PUBLIC_PTG_HERO_ART_BRAND?.trim();
  if (custom) return custom;
  return DEFAULT_HERO_BRAND_WEBP_PATH;
}

/** Variante mobile optionnelle pour le fond marque (`picture` &lt;640px). */
export function heroBrandIllustrationMobileSrc(): string | null {
  const m = process.env.NEXT_PUBLIC_PTG_HERO_ART_BRAND_MOBILE?.trim();
  return m || null;
}

/** Affiche livret : PNG par défaut (présent dès que `brand-poster.png` est dans `public/hero/`). */
export const DEFAULT_ABOUT_LIVRET_POSTER_PNG_PATH = "/hero/brand-poster.png" as const;
/** Variante WebP après `npm run optimize:hero` — ex. `NEXT_PUBLIC_PTG_ABOUT_LIVRET_POSTER=/hero/brand-poster.webp`. */
export const DEFAULT_ABOUT_LIVRET_POSTER_WEBP_PATH = "/hero/brand-poster.webp" as const;

/**
 * Illustration page livret « L’univers en une image ». Indépendante du bandeau marque (`heroBrandIllustrationSrc`).
 * Surcharge : `NEXT_PUBLIC_PTG_ABOUT_LIVRET_POSTER`.
 */
export function aboutLivretPosterSrc(): string {
  const custom = process.env.NEXT_PUBLIC_PTG_ABOUT_LIVRET_POSTER?.trim();
  if (custom) return custom;
  return DEFAULT_ABOUT_LIVRET_POSTER_PNG_PATH;
}

/** Repli local si une URL `.webp` sous `public/` est absente (fichier non généré). */
export function aboutLivretPosterLocalFallback(src: string): string | null {
  if (src.startsWith("http://") || src.startsWith("https://")) return null;
  if (src.endsWith(".webp")) return DEFAULT_ABOUT_LIVRET_POSTER_PNG_PATH;
  return null;
}

/** Repli `*.webp` → `*.png` pour les chemins statiques sous `/hero/` (même basename). */
export function heroPublicWebpFallbackPng(src: string): string | null {
  if (!src.startsWith("/hero/") || !src.endsWith(".webp")) return null;
  return `${src.slice(0, -5)}.png`;
}

/**
 * Variante mobile optionnelle (art direction) pour le hero : élément `picture` sous `(max-width: 639px)`.
 * Absent = une seule image `heroIllustrationSrc()`.
 */
export function heroIllustrationMobileSrc(): string | null {
  const m = process.env.NEXT_PUBLIC_PTG_HERO_ART_MOBILE?.trim();
  return m || null;
}

/**
 * Image hero **uniquement** en `(max-width: 720px) and (orientation: portrait)` (rail visuel accueil).
 * Surcharge : `NEXT_PUBLIC_PTG_HERO_ART_PORTRAIT_RAIL`. Défaut : WebP généré depuis `landing-watercolor-portrait-rail.png` (`optimize:hero`).
 */
export function heroIllustrationPortraitRailSrc(): string {
  const custom = process.env.NEXT_PUBLIC_PTG_HERO_ART_PORTRAIT_RAIL?.trim();
  if (custom) return custom;
  return DEFAULT_HERO_PORTRAIT_RAIL_WEBP_PATH;
}

/** Scène marché sous la bande ciné accueil (`landing-home-market-atmosphere.png` + `optimize:hero`). */
export const DEFAULT_HOME_MARKET_ATMOSPHERE_WEBP_PATH = "/hero/landing-home-market-atmosphere.webp" as const;

export function heroHomeMarketAtmosphereSrc(): string {
  const custom = process.env.NEXT_PUBLIC_PTG_HOME_MARKET_ATMOSPHERE_ART?.trim();
  if (custom) return custom;
  return DEFAULT_HOME_MARKET_ATMOSPHERE_WEBP_PATH;
}

/**
 * Rejeu automatique de la bande ciné accueil (secondes entre deux cycles complets).
 * Défaut **60** ; minimum **30** pour limiter la fatigue visuelle ; plafond **600**.
 * Désactiver : `NEXT_PUBLIC_PTG_CINEMATIC_AUTO_REPLAY_SEC=0` (ou `off` / `false`).
 * Ignoré si pause mouvement, `prefers-reduced-motion`, ou onglet non visible au moment du déclenchement.
 */
export function cinematicAutoReplayIntervalSec(): number | null {
  return parseCinematicAutoReplayIntervalSec(process.env.NEXT_PUBLIC_PTG_CINEMATIC_AUTO_REPLAY_SEC);
}

/**
 * Variante mobile optionnelle pour le bandeau nuit. Absent = pas de source séparée (même URL que `heroNightIllustrationSrc()`).
 */
export function heroNightIllustrationMobileSrc(): string | null {
  const m = process.env.NEXT_PUBLIC_PTG_HERO_ART_NIGHT_MOBILE?.trim();
  return m || null;
}

/**
 * Image Open Graph / Twitter (carte de partage). Dédiée : `NEXT_PUBLIC_PTG_OG_IMAGE` (1200×630 recommandé).
 * Sinon : même source que `heroIllustrationSrc()` (défaut ou `NEXT_PUBLIC_PTG_HERO_ART`).
 * Pour une carte dédiée type affiche : `NEXT_PUBLIC_PTG_OG_IMAGE=/og/paye-ta-graille-share.webp` après `optimize:hero`.
 */
export function shareSocialPreviewImageUrl(): string {
  const og = process.env.NEXT_PUBLIC_PTG_OG_IMAGE?.trim();
  if (og) return og;
  return heroIllustrationSrc();
}
