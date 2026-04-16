import type { MetadataRoute } from "next";
import { isPublicBeta } from "@/lib/public-beta";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  if (isPublicBeta()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /** Espace connecté / outils internes : pas d’indexation même si un lien fuite. */
      disallow: ["/api/", "/interne/"],
    },
    sitemap: new URL("/sitemap.xml", base).toString(),
  };
}
