import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AmbientAppEffects } from "@/components/AmbientAppEffects";
import { BetaBanner } from "@/components/BetaBanner";
import { SkipLink } from "@/components/SkipLink";
import { shareSocialPreviewImageUrl } from "@/lib/env-public";
import { MARKETING_CORE_PROMISE, MARKETING_HERO_PRIMARY, MARKETING_TAGLINE_GOLDEN } from "@/lib/marketing-copy";
import { isPublicBeta } from "@/lib/public-beta";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const sharePreviewImageUrl = shareSocialPreviewImageUrl();

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Paye ta graille",
    template: "%s · Paye ta graille",
  },
  description: `${MARKETING_HERO_PRIMARY} ${MARKETING_TAGLINE_GOLDEN} ${MARKETING_CORE_PROMISE} j’invite, 50/50, je me fais inviter.`,
  applicationName: "Paye ta graille",
  ...(isPublicBeta() ? { robots: { index: false, follow: false } } : {}),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Paye ta graille",
    title: "Paye ta graille",
    description: `${MARKETING_TAGLINE_GOLDEN} ${MARKETING_CORE_PROMISE} Pas dating-first : repas réel, réseau social IRL.`,
    images: [
      {
        url: sharePreviewImageUrl,
        alt: "Paye ta graille, illustration du repas partagé",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paye ta graille",
    description: `${MARKETING_HERO_PRIMARY} ${MARKETING_TAGLINE_GOLDEN} Table d’abord.`,
    images: [sharePreviewImageUrl],
  },
};

export const viewport: Viewport = {
  /** Aligné `--ptg-bg` (`ptg-tokens.css`) pour barre d’état / PWA */
  themeColor: "#fbf6ef",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <AmbientAppEffects />
        <SkipLink />
        <BetaBanner />
        <main id="contenu-principal" tabIndex={-1} aria-label="Contenu principal">
          {children}
        </main>
      </body>
    </html>
  );
}
