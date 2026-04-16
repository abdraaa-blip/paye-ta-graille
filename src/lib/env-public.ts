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
 * Fond illustré type aquarelle sur la landing. Désactiver : `NEXT_PUBLIC_PTG_HERO_ILLUSTRATION=0`.
 */
export function heroIllustrationEnabled(): boolean {
  return !isNegativePublicFlag(process.env.NEXT_PUBLIC_PTG_HERO_ILLUSTRATION);
}

/**
 * Chemin sous `public/` ou URL `http(s)://…` (host autorisé au build via `next.config.ts`).
 * Défaut : WebP (`npm run optimize:hero`, fichier `public/hero/landing-watercolor.webp`).
 */
export function heroIllustrationSrc(): string {
  const custom = process.env.NEXT_PUBLIC_PTG_HERO_ART?.trim();
  if (custom) return custom;
  return "/hero/landing-watercolor.webp";
}
