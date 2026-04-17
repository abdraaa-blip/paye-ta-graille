/**
 * Variables publiques attendues par l'app (sans secrets).
 * URLs `http(s)://` pour images : `config/public-hero-image-url-env-keys.json` + `public-hero-image-url-env-keys.ts`.
 */
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
 * Fond illustré raster sur l’accueil. Désactiver : `NEXT_PUBLIC_PTG_HERO_ILLUSTRATION=0`.
 */
export function heroIllustrationEnabled(): boolean {
  return !isNegativePublicFlag(process.env.NEXT_PUBLIC_PTG_HERO_ILLUSTRATION);
}

/** WebP hero versionné dans `public/hero/` (généré par `npm run optimize:hero`). */
export const DEFAULT_HERO_WEBP_PATH = "/hero/landing-watercolor.webp" as const;
/** Illustration « marché / marque » (pages type À propos). WebP généré par `optimize:hero` si le PNG est présent. */
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
 * Fond illustré « marque » (composition riche). Défaut : `brand-marketplace.webp`.
 * Surcharge : `NEXT_PUBLIC_PTG_HERO_ART_BRAND`.
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

/**
 * Variante mobile optionnelle (art direction) pour le hero : élément `picture` sous `(max-width: 639px)`.
 * Absent = une seule image `heroIllustrationSrc()`.
 */
export function heroIllustrationMobileSrc(): string | null {
  const m = process.env.NEXT_PUBLIC_PTG_HERO_ART_MOBILE?.trim();
  return m || null;
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
 */
export function shareSocialPreviewImageUrl(): string {
  const og = process.env.NEXT_PUBLIC_PTG_OG_IMAGE?.trim();
  if (og) return og;
  return heroIllustrationSrc();
}
