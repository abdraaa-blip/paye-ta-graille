import type { Metadata } from "next";
import Script from "next/script";
import { AProposClient } from "@/components/AProposClient";
import { SiteFooter } from "@/components/SiteFooter";
import {
  ABOUT_BRAND_NAME,
  ABOUT_PAGE_KEYWORDS,
  ABOUT_PAGE_SHARE_DESCRIPTION,
} from "@/lib/about-copy";
import { getSiteUrl } from "@/lib/site-url";

const aboutPath = "/a-propos";

export const metadata: Metadata = {
  title: "À propos",
  description: `${ABOUT_BRAND_NAME} : concept, intentions, sociabilité autour du repas, partage et vision. Livret interactif « carte de restaurant » et index des pages.`,
  keywords: [...ABOUT_PAGE_KEYWORDS],
  alternates: { canonical: aboutPath },
  openGraph: {
    type: "website",
    title: `À propos · ${ABOUT_BRAND_NAME}`,
    description: ABOUT_PAGE_SHARE_DESCRIPTION,
    url: aboutPath,
  },
  twitter: {
    card: "summary_large_image",
    title: `À propos · ${ABOUT_BRAND_NAME}`,
    description: ABOUT_PAGE_SHARE_DESCRIPTION,
  },
};

export default function AProposPage() {
  const site = getSiteUrl();
  const aboutUrl = new URL(aboutPath, site).toString();
  const homeUrl = new URL("/", site).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        name: `À propos · ${ABOUT_BRAND_NAME}`,
        description: ABOUT_PAGE_SHARE_DESCRIPTION,
        url: aboutUrl,
        isPartOf: {
          "@type": "WebSite",
          name: ABOUT_BRAND_NAME,
          url: site.toString(),
        },
        inLanguage: "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: homeUrl },
          { "@type": "ListItem", position: 2, name: "À propos", item: aboutUrl },
        ],
      },
    ],
  };

  return (
    <div className="ptg-page">
      <Script id="about-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AProposClient />
      <SiteFooter />
    </div>
  );
}
