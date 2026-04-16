import type { MetadataRoute } from "next";

/** PWA / install prompt léger : couleurs alignées `layout` viewport `themeColor`. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Paye ta graille",
    short_name: "Paye ta graille",
    description: "Rencontres autour du repas réel : invite, partage, réseau IRL.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf6ef",
    theme_color: "#fbf6ef",
    lang: "fr",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
