import data from "../../config/public-hero-image-url-env-keys.json";

const raw = data.keys;
if (!Array.isArray(raw) || !raw.every((k): k is string => typeof k === "string" && k.length > 0)) {
  throw new Error("config/public-hero-image-url-env-keys.json : champ « keys » invalide");
}

/**
 * Clés `process.env` pouvant contenir une URL `http(s)://…` pour images hero / variantes.
 * Source JSON : `config/public-hero-image-url-env-keys.json` (lu aussi par `deploy-preflight.mjs`).
 * Toute nouvelle variable d’URL image côté client : éditer le JSON + `env-public` + `.env.example`.
 */
export const PUBLIC_HERO_IMAGE_URL_ENV_KEYS = raw as readonly string[];

export type PublicHeroImageUrlEnvKey = (typeof PUBLIC_HERO_IMAGE_URL_ENV_KEYS)[number];
