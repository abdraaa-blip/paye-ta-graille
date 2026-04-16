import type { Metadata } from "next";
import Link from "next/link";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { PTG_LOCAL_AUTH_EMAIL_KEY, PTG_LOCAL_AUTH_REMEMBER_EMAIL_KEY } from "@/lib/auth/device-email-hint";
import { UX_BACK } from "@/lib/ux-copy";

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
            {UX_BACK.marketingHome}
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

          <h2 className="ptg-type-prose-h2">Stockage local sur ton appareil</h2>
          <p>
            Sur la page{" "}
            <Link href="/auth">Connexion</Link>, tu peux demander à mémoriser ton adresse e-mail pour
            aller plus vite aux prochaines visites. Ces informations sont enregistrées uniquement dans
            ton navigateur (<strong>localStorage</strong>), pas pour du suivi publicitaire. Tu peux
            décocher la case, utiliser « Oublier l&apos;adresse mémorisée » sur la même page, ou effacer
            les données du site dans les réglages du navigateur. Clés utilisées :{" "}
            <code>{PTG_LOCAL_AUTH_EMAIL_KEY}</code>, <code>{PTG_LOCAL_AUTH_REMEMBER_EMAIL_KEY}</code>.
            Te déconnecter depuis l&apos;application ne supprime pas automatiquement cette mémoire
            locale : pense à le faire sur <Link href="/auth">Connexion</Link> si tu partages
            l&apos;appareil.
          </p>

          <h2 className="ptg-type-prose-h2">Session connectée</h2>
          <p>
            Une fois connecté·e, le site utilise des <strong>cookies techniques</strong> (fournisseur
            d&apos;authentification Supabase) pour maintenir ta session et la rafraîchir sans te redemander
            un code à chaque visite, dans la limite des durées configurées côté service. Pour mettre fin
            à la session sur cet appareil, utilise <strong>Me déconnecter</strong> dans l&apos;app ; sur un
            appareil partagé, privilégie cette déconnexion ou la navigation privée.
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
