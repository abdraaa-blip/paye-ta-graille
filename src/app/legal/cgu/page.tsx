import type { Metadata } from "next";
import Link from "next/link";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { UX_BACK } from "@/lib/ux-copy";

export const metadata: Metadata = {
  title: "Conditions d'utilisation · Paye ta graille",
  description: "Cadre d'usage de la plateforme Paye ta graille.",
};

export default function CguPage() {
  return (
    <div className="ptg-page">
      <PtgAppFlow decor="none">
        <div className="ptg-page-inner" style={{ maxWidth: "40rem" }}>
          <Link href="/" className="ptg-link-back">
            {UX_BACK.marketingHome}
          </Link>
        <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
          Conditions d&apos;utilisation
        </h1>
        <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
        <p className="ptg-banner">Cadre d&apos;usage officiel de la version en ligne Paye ta graille.</p>

        <article className="ptg-type-body" style={{ marginTop: "1.5rem", lineHeight: 1.65 }}>
          <h2 className="ptg-type-prose-h2">1. Objet</h2>
          <p>
            Paye ta graille met en relation des personnes autour d&apos;un repas réel. Le service peut
            être incomplet ou instable pendant les premières versions.
          </p>

          <h2 className="ptg-type-prose-h2">2. Comportement attendu</h2>
          <p>
            Respect, intentions claires, lieux publics pour les premières rencontres. Tout contenu
            illégal ou harcelant peut entraîner une exclusion.
          </p>

          <h2 className="ptg-type-prose-h2">3. Rencontres IRL</h2>
          <p>
            Tu restes responsable de tes choix et de ta sécurité. La plateforme ne garantit ni le
            comportement des autres utilisateurs ni l&apos;issue des repas.
          </p>

          <h2 className="ptg-type-prose-h2">4. Contact et moderation</h2>
          <p>
            Signaler un probleme via <Link href="/signaler">Signaler un probleme</Link>. Les contenus
            illegaux, harcelants ou dangereux peuvent etre supprimes et le compte suspendu.
          </p>
        </article>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
