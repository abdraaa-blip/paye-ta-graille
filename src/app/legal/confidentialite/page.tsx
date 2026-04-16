import type { Metadata } from "next";
import Link from "next/link";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { PTG_LOCAL_AUTH_EMAIL_KEY, PTG_LOCAL_AUTH_REMEMBER_EMAIL_KEY } from "@/lib/auth/device-email-hint";
import { UX_BACK } from "@/lib/ux-copy";

export const metadata: Metadata = {
  title: "Confidentialité · Paye ta graille",
  description: "Politique de confidentialité Paye ta graille.",
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
        <p className="ptg-banner">
          Donnees minimales, pas de publicite tierce, et controle utilisateur des rappels.
        </p>

        <article className="ptg-type-body" style={{ marginTop: "1.5rem", lineHeight: 1.65 }}>
          <h2 className="ptg-type-prose-h2">Données traitées (cible produit)</h2>
          <p>
            Compte (email), profil (pseudo, ville, intentions, tags), données de repas (créneaux,
            statuts), messages liés à un repas, signalements, événements d&apos;usage produit
            (statistiques first-party lorsque tu es connecté·e), mémoire privée sur les lieux et
            préférences associées.
          </p>

          <h2 className="ptg-type-prose-h2">Finalités</h2>
          <p>
            Fournir le service, sécurité et modération, amélioration produit dans le respect du cadre
            légal et des paramètres de rappels choisis par l&apos;utilisateur.
          </p>

          <h2 className="ptg-type-prose-h2">Statistiques produit (first-party)</h2>
          <p>
            Lorsque tu utilises l&apos;app connectée, des événements d&apos;usage peuvent être
            enregistrés côté serveur (ex. parcours dans l&apos;interface, clics utiles au produit),
            sans traceurs publicitaires tiers ni mesure d&apos;audience « classique » type réseaux
            sociaux. L&apos;objectif est de mesurer ce qui aide vraiment les personnes et d&apos;améliorer
            le service ; les agrégats internes (tableaux de bord) restent réservés à l&apos;équipe
            produit sous contrôle d&apos;accès.
          </p>

          <h2 className="ptg-type-prose-h2">Seconde graille (surplus alimentaire)</h2>
          <p>
            Les annonces de récupération sont pensées pour la discrétion : l&apos;identité du donneur
            n&apos;est pas exposée comme sur un fil public classique ; les informations de contact
            pertinentes sont partagées seulement dans le cadre prévu entre les personnes concernées
            (donneur et personne qui récupère), conformément au comportement de l&apos;application.
          </p>

          <h2 className="ptg-type-prose-h2">Lieux &amp; mémoire perso</h2>
          <p>
            Tu peux enregistrer des notes et préférences sur des lieux pour toi seul·e : ces contenus
            sont liés à ton compte et traités comme des données personnelles (accès restreint par
            compte). Si tu choisis une option de recommandation collective, seuls des signaux
            agrégés et anonymisés peuvent être utilisés pour refléter une tendance, pas la publication
            de ton avis mot pour mot.
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
            Acces, rectification, suppression, opposition, portabilite: demande via{" "}
            <Link href="/signaler">Signaler</Link>. Delai cible de traitement: 30 jours.
          </p>
          <p>
            En attendant une procédure DPO détaillée, pour un problème de contenu ou de sécurité tu
            peux passer par <Link href="/signaler">Signaler</Link> (compte connecté requis).
          </p>
        </article>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
