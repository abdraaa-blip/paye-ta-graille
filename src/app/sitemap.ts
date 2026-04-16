import type { MetadataRoute } from "next";
import { isPublicBeta } from "@/lib/public-beta";
import { getSiteUrl } from "@/lib/site-url";

/** Routes marketing / légal indexables (hors espace connecté dynamique). */
const PUBLIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] =
  [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/a-propos", changeFrequency: "monthly", priority: 0.85 },
    { path: "/commencer", changeFrequency: "monthly", priority: 0.8 },
    { path: "/decouvrir", changeFrequency: "weekly", priority: 0.75 },
    { path: "/experiences", changeFrequency: "monthly", priority: 0.65 },
    { path: "/lieux", changeFrequency: "monthly", priority: 0.65 },
    { path: "/reseau-graille", changeFrequency: "monthly", priority: 0.65 },
    { path: "/repas-ouverts", changeFrequency: "weekly", priority: 0.65 },
    { path: "/partenaires", changeFrequency: "monthly", priority: 0.52 },
    { path: "/graille-plus", changeFrequency: "monthly", priority: 0.55 },
    { path: "/partage-graille", changeFrequency: "monthly", priority: 0.55 },
    { path: "/seconde-graille", changeFrequency: "monthly", priority: 0.55 },
    { path: "/paiement-repas", changeFrequency: "monthly", priority: 0.5 },
    { path: "/legal/cgu", changeFrequency: "yearly", priority: 0.4 },
    { path: "/legal/confidentialite", changeFrequency: "yearly", priority: 0.4 },
    { path: "/signaler", changeFrequency: "yearly", priority: 0.35 },
  ];

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPublicBeta()) {
    return [];
  }

  const base = getSiteUrl();
  const lastModified = new Date();

  return PUBLIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, base).toString(),
    lastModified,
    changeFrequency,
    priority,
  }));
}
