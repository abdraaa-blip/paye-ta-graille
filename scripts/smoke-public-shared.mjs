/** Liste et règles communes : `smoke-public.mjs` (Node) et `e2e/smoke-public.spec.ts` (Playwright). */

export const SMOKE_ROUTES = [
  "/",
  "/a-propos",
  "/hero/landing-watercolor.webp",
  "/hero/landing-home-market-atmosphere.webp",
  "/hero/brand-logo-signature.webp",
  "/accueil",
  "/commencer",
  "/auth",
  "/onboarding",
  "/decouvrir",
  "/repas",
  "/repas/nouveau",
  "/repas-ouverts",
  "/experiences",
  "/lieux",
  "/reseau-graille",
  "/moi",
  "/profil",
  "/signaler",
  "/partenaires",
  "/univers-visuel",
  "/graille-plus",
  "/partage-graille",
  "/seconde-graille",
  "/paiement-repas",
  "/legal/cgu",
  "/legal/confidentialite",
  "/route-inexistante-test-404",
  "/robots.txt",
  "/manifest.webmanifest",
  "/sitemap.xml",
  "/api/health",
];

/** Kicker hero : lien vers À propos + classe pill. */
export const HOME_EXPECT_KICKER_MARKERS = ['href="/a-propos"', "ptg-kicker-pill--link"];

/** Bande signature sous le hero (composant client, shell SSR). */
export const HOME_EXPECT_CINEMATIC_MARKER = "ptg-home-cinematic-band";

/** Image illustrative marché sous la bande ciné (SSR). */
export const HOME_EXPECT_MARKET_MARKER = "ptg-home-market-band";

/** Attribut serveur sur `.ptg-page` : `off` = pas d’illustration raster ni de bande (`NEXT_PUBLIC_PTG_HERO_ILLUSTRATION=0`). */
export const HOME_DATA_HERO_RASTER_OFF = 'data-ptg-hero-raster="off"';

export const EXPECTED_STATUS = new Map([
  ["/api/health", 200],
  ["/route-inexistante-test-404", 404],
]);

/** Pages marketing avec `NightStageDecor` (SSR attendu : cadre + faisceaux). */
export const NIGHT_STAGE_MARKETING_ROUTES = ["/partenaires", "/experiences", "/repas-ouverts"];

export function validateHealthJson(json) {
  if (json?.ok !== true || typeof json?.version !== "string" || !json.version.length) {
    return "health JSON missing ok/version";
  }
  if ("checkNonce" in json) {
    return "health JSON exposes forbidden checkNonce";
  }
  return null;
}

export function validateHomeHtml(html) {
  const missing = HOME_EXPECT_KICKER_MARKERS.filter((m) => !html.includes(m));
  if (missing.length > 0) {
    return `home HTML missing hero kicker markers: ${missing.join(", ")}`;
  }
  const heroRasterOff = html.includes(HOME_DATA_HERO_RASTER_OFF);
  if (!heroRasterOff && !html.includes(HOME_EXPECT_CINEMATIC_MARKER)) {
    return `home HTML missing bande signature (${HOME_EXPECT_CINEMATIC_MARKER})`;
  }
  if (!heroRasterOff && !html.includes(HOME_EXPECT_MARKET_MARKER)) {
    return `home HTML missing bande marché (${HOME_EXPECT_MARKET_MARKER})`;
  }
  if (heroRasterOff && html.includes(HOME_EXPECT_CINEMATIC_MARKER)) {
    return "home HTML: data-ptg-hero-raster=off but bande signature present (incoherent build)";
  }
  if (heroRasterOff && html.includes(HOME_EXPECT_MARKET_MARKER)) {
    return "home HTML: data-ptg-hero-raster=off but bande marché present (incoherent build)";
  }
  if (!/property\s*=\s*["']og:image["']/i.test(html)) {
    return "home HTML missing meta property og:image (Open Graph)";
  }
  return null;
}

/** Bandeau bas illustré (même composant sur les trois routes). */
export function validateNightStageMarketingHtml(html) {
  if (!html.includes("ptg-night-stage")) {
    return "HTML missing ptg-night-stage";
  }
  if (!html.includes("ptg-night-stage__beam")) {
    return "HTML missing ptg-night-stage__beam";
  }
  return null;
}

export function validateManifestText(text) {
  if (!text.includes("Paye ta graille")) {
    return "manifest missing expected app name";
  }
  return null;
}

export function validateRobotsText(text) {
  const hasApi = text.includes("Disallow: /api/");
  const hasInterne = text.includes("Disallow: /interne/");
  if (hasApi && hasInterne) return null;

  const fullSiteDisallow = text.split(/\r?\n/).some((line) => /^\s*Disallow:\s*\/\s*$/i.test(line));
  if (fullSiteDisallow && !hasApi) return null;

  if (hasApi && !hasInterne) {
    return "robots.txt should disallow /interne/";
  }
  return "robots.txt: prod attend Disallow: /api/ + /interne/ ; bêta publique une ligne Disallow: /";
}
