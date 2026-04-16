import type { Metadata } from "next";
import Link from "next/link";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Confidentialité · Paye ta graille",
  description: "Politique de confidentialité Paye ta graille (texte provisoire).",
};

export default function ConfidentialitePage() {
  return (
    <div className="ptg-page">
      <PtgAppFlow decor="none">
        <div className="ptg-page-inner" style={{ maxWidth: "40rem" }}>
          <Link href="/" className="ptg-link-back">
            ← Accueil
          </Link>
        <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
          Politique de confidentialité
        </h1>
        <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
        <p className="ptg-banner ptg-banner-warn">
          <strong>Texte provisoire.</strong> Les détails sur les sous-traitants, les durées de
          conservation et l&apos;exercice de tes droits seront précisés dans une version à jour avant
          une utilisation large.
        </p>

        <article className="ptg-type-body" style={{ marginTop: "1.5rem", lineHeight: 1.65 }}>
          <h2 className="ptg-type-prose-h2">Données traitées (cible produit)</h2>
          <p>
            Compte (email), profil (pseudo, ville, intentions, tags), données de repas (créneaux,
            statuts), messages liés à un repas, signalements.
          </p>

          <h2 className="ptg-type-prose-h2">Finalités</h2>
          <p>
            Fournir le service, sécurité et modération, amélioration produit dans le respect du cadre
            légal et des paramètres de rappels choisis par l&apos;utilisateur.
          </p>

          <h2 className="ptg-type-prose-h2">Tes droits</h2>
          <p>
            Accès, rectification, suppression, opposition, portabilité : décris le canal (email DPO /
            support) et les délais de réponse une fois l&apos;offre stabilisée.
          </p>
        </article>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
