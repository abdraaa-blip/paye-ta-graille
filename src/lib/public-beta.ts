/**
 * Bêta publique : bandeau, noindex (layout), robots/sitemap restreints.
 * Une seule source de vérité avec `NEXT_PUBLIC_PTG_PUBLIC_BETA=1`.
 */
export function isPublicBeta(): boolean {
  return process.env.NEXT_PUBLIC_PTG_PUBLIC_BETA === "1";
}
