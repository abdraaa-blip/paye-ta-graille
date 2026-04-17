/**
 * Variables publiques attendues par l'app (sans secrets).
 */

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
 * Image Open Graph / Twitter (carte de partage). Dédiée : `NEXT_PUBLIC_PTG_OG_IMAGE` (1200×630 recommandé).
 * Sinon : même source que `heroIllustrationSrc()` (défaut ou `NEXT_PUBLIC_PTG_HERO_ART`).
 */
export function shareSocialPreviewImageUrl(): string {
  const og = process.env.NEXT_PUBLIC_PTG_OG_IMAGE?.trim();
  if (og) return og;
  return heroIllustrationSrc();
}
