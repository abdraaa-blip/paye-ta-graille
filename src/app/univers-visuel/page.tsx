import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { SiteFooter } from "@/components/SiteFooter";
import {
  BRAND_LOGO_SIGNATURE_HEIGHT,
  BRAND_LOGO_SIGNATURE_WEBP_SRC,
  BRAND_LOGO_SIGNATURE_WIDTH,
} from "@/lib/brand-logo";

export const metadata: Metadata = {
  title: "Univers visuel",
  description: "Vitrine visuelle Paye ta Graille : affiches et signatures de marque curées.",
};

const VISUALS = [
  {
    id: "hero-poster",
    title: "Affiche manifeste",
    blurb: "Le visuel signature qui ouvre le livret et pose la promesse de marque.",
    src: "/hero/brand-poster.png",
    width: 572,
    height: 1024,
    alt: "Affiche Paye ta Graille avec slogan et ambiance culinaire.",
  },
  {
    id: "campaign",
    title: "Campagne slogan",
    blurb: "Version éditoriale orientée convivialité et partage de quartier.",
    src: "/hero/livret-campagne-slogan.png",
    width: 1024,
    height: 682,
    alt: "Visuel campagne Paye ta Graille avec slogan et compositions culinaires.",
  },
  {
    id: "market-manifesto",
    title: "Manifeste marché",
    blurb: "Interprétation terrain : table, monnaie, cuisine réelle, ancrage local.",
    src: "/hero/livret-manifeste-marche.png",
    width: 1024,
    height: 683,
    alt: "Visuel manifeste Paye ta Graille dans une ambiance de marché.",
  },
  {
    id: "logo-signature",
    title: "Logo signature",
    blurb: "Identité finale utilisée en clôture de livret et signatures de marque.",
    src: BRAND_LOGO_SIGNATURE_WEBP_SRC,
    width: BRAND_LOGO_SIGNATURE_WIDTH,
    height: BRAND_LOGO_SIGNATURE_HEIGHT,
    alt: "Logo Paye ta Graille sur fond transparent.",
  },
];

export default function UniversVisuelPage() {
  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
          <AppNav />
          <PtgMenuCard variant="apricot" stamp="Vitrine de marque">
            <div className="ptg-page-head">
              <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
                Univers visuel
              </h1>
              <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
              <p className="ptg-type-body" style={{ margin: 0 }}>
                Une sélection volontairement courte des visuels forts de Paye ta Graille. Ici, on montre l&apos;ADN de marque, pas une
                bibliothèque brute d&apos;assets.
              </p>
            </div>
          </PtgMenuCard>

          <div className="ptg-visual-grid" style={{ marginBottom: "1rem" }}>
            {VISUALS.map((v) => (
              <article key={v.id} className="ptg-surface ptg-surface--static ptg-card">
                <div className="ptg-visual-frame">
                  <Image
                    src={v.src}
                    alt={v.alt}
                    width={v.width}
                    height={v.height}
                    sizes="(max-width: 859px) 92vw, 44vw"
                    quality={v.id === "logo-signature" ? 100 : 82}
                    className={
                      v.id === "logo-signature"
                        ? "ptg-visual-frame__img ptg-visual-frame__img--contain"
                        : "ptg-visual-frame__img"
                    }
                  />
                </div>
                <p className="ptg-card-title" style={{ margin: "0 0 0.35rem", fontSize: "var(--ptg-text-md-sm)" }}>
                  {v.title}
                </p>
                <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)", maxWidth: "none" }}>
                  {v.blurb}
                </p>
              </article>
            ))}
          </div>

          <div className="ptg-stack ptg-stack--tight">
            <Link href="/a-propos#livret-univers" className="ptg-btn-primary" style={{ textAlign: "center" }}>
              Ouvrir le livret visuel
            </Link>
            <Link href="/a-propos#apropos-services" className="ptg-btn-ghost" style={{ textAlign: "center", textDecoration: "none" }}>
              Retour à l’index des pages
            </Link>
          </div>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}

