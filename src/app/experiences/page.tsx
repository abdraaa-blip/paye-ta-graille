import type { Metadata } from "next";
import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { SiteFooter } from "@/components/SiteFooter";
import { GROWTH_EXPERIENCES_SLOGAN } from "@/lib/growth-copy";

export const metadata: Metadata = {
  title: "Expériences",
  description:
    "Expériences culinaires organisées : le troisième pilier Paye ta graille, rejoindre plutôt que chercher seul.",
};

const CATEGORIES = [
  {
    title: "Restaurants immersifs",
    items: ["Dîner dans le noir", "Repas sensoriels", "Expériences multi-sensorielles"],
  },
  {
    title: "Nature",
    items: ["Pique-nique organisé", "Brunch parc", "Barbecue collectif", "Randonnée + repas"],
  },
  {
    title: "Cuisine du monde",
    items: ["Soirées thématiques", "Street food", "Découverte d’un pays"],
  },
  {
    title: "Social food",
    items: ["Tables longues", "Speed dinner", "Dîner conversation guidée"],
  },
  {
    title: "Participatif",
    items: ["Cuisiner ensemble", "Ateliers", "Chacun apporte un ingrédient"],
  },
] as const;

/** Tables à tonalité claire : inclusif, jamais exclusif, chacun trouve sa place. */
const AFFINITY_EXPERIENCES = [
  { title: "Table healthy", blurb: "Léger, convivial, zéro cours de nutrition." },
  { title: "Soirée végétarienne", blurb: "Plantes à l’honneur, ouverts aux curieux." },
  { title: "Viande & braises", blurb: "Pour ceux qui aiment le feu et le partage." },
  { title: "Cuisine du monde", blurb: "Découverte sans prise de tête." },
] as const;

export default function ExperiencesPage() {
  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
        <AppNav />
        <PtgMenuCard variant="spark" stamp="Carte surprise">
          <div className="ptg-page-head">
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              Expériences Paye ta graille
            </h1>
            <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
            <p
              className="ptg-type-body"
              style={{
                margin: "0 0 0.65rem",
                fontSize: "var(--ptg-text-md-sm)",
                fontWeight: 700,
                lineHeight: 1.35,
                color: "var(--ptg-rose-dish)",
              }}
            >
              {GROWTH_EXPERIENCES_SLOGAN}
            </p>
            <p className="ptg-type-body" style={{ margin: "0 0 0" }}>
              Tu passes de « je mange avec quelqu’un » à « <strong>je participe à une expérience alimentaire organisée</strong> ».
              Ce n’est pas un agenda d’événements générique : tout reste <strong>social</strong>, <strong>autour du repas réel</strong>,{" "}
              <strong>sans</strong> te transformer en marketplace de résas.
            </p>
          </div>
        </PtgMenuCard>

        <div className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
          <p className="ptg-card-title" style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-md-sm)" }}>
            Les 3 niveaux
          </p>
          <ul className="ptg-type-body ptg-prose-list" style={{ margin: 0, fontSize: "var(--ptg-text-ui-sm)" }}>
            <li>
              <strong>Individuel</strong> : 1 à 1, intentions claires →{" "}
              <Link href="/decouvrir" style={{ fontWeight: 600 }}>
                Autour de toi
              </Link>
            </li>
            <li>
              <strong>Groupe</strong> : repas entre inconnus, fil spontané →{" "}
              <Link href="/repas-ouverts" style={{ fontWeight: 600 }}>
                Repas ouverts
              </Link>
            </li>
            <li>
              <strong>Événements</strong> : expériences organisées, places limitées, <em>bientôt dans l’app</em>
            </li>
          </ul>
        </div>

        <h2 style={{ fontSize: "var(--ptg-text-base)", fontWeight: 700, margin: "0 0 0.65rem" }}>Des tables pour chaque envie</h2>
        <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)", color: "var(--ptg-text-muted)" }}>
          Des idées de moments pour se retrouver sans se prendre la tête : léger, inclusif, loin d’un cours ou d’un régime.
        </p>
        <div className="ptg-stack ptg-stack--dense" style={{ marginBottom: "1.25rem" }}>
          {AFFINITY_EXPERIENCES.map((row) => (
            <div key={row.title} className="ptg-surface ptg-surface--static ptg-card--inset">
              <p style={{ margin: "0 0 0.25rem", fontWeight: 700, fontSize: "var(--ptg-text-ui-sm)" }}>{row.title}</p>
              <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
                {row.blurb}
              </p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: "var(--ptg-text-base)", fontWeight: 700, margin: "0 0 0.65rem" }}>Exemples d’expériences</h2>
        <div className="ptg-stack ptg-stack--tight" style={{ marginBottom: "1.25rem" }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.title} className="ptg-surface ptg-surface--static ptg-card--inset">
              <p style={{ margin: "0 0 0.35rem", fontWeight: 700, fontSize: "var(--ptg-text-md-sm)" }}>{cat.title}</p>
              <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
                {cat.items.join(" · ")}
              </p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: "var(--ptg-text-base)", fontWeight: 700, margin: "0 0 0.65rem" }}>Comment ça marchera</h2>
        <ol className="ptg-type-body ptg-prose-list" style={{ margin: "0 0 1.25rem", fontSize: "var(--ptg-text-ui-sm)" }}>
          <li>L’app ou un partenaire <strong>crée</strong> l’événement : lieu, thème, date, nombre de places.</li>
          <li>Tu <strong>rejoins</strong> en un geste : places limitées, confirmation simple.</li>
          <li>
            <strong>Organisation</strong> : groupe assigné ou participation libre ; pour les repas à plusieurs, le module «
            qui ramène quoi » reste le bon outil (sans complexité inutile).
          </li>
        </ol>

        <p className="ptg-banner ptg-banner-warn" style={{ marginBottom: "1rem" }}>
          <strong>Pas encore réservable.</strong> On ouvrira les inscriptions quand le cadre avec les lieux et la confiance
          utilisateur sera solide, pas pour transformer l’app en billetterie générique.
        </p>

        <div className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
          <p className="ptg-card-title" style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-md-sm)" }}>
            Solidarité &amp; maraudes (piste)
          </p>
          <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-ui-sm)", lineHeight: 1.55 }}>
            Une idée en réflexion : des <strong>actions collectives</strong> (ex. maraude) avec date fixée suffisamment à
            l&apos;avance, rôles clairs et transparence ; <strong>pas encore dans l&apos;app</strong>, car ça touche à la
            confiance, à la sécurité des lieux et souvent à la <strong>mise en commun d&apos;argent</strong> (responsabilité,
            remboursements). Si le cœur « repas &amp; rencontres » est solide, ce volet pourrait arriver en{" "}
            <strong>module dédié</strong>, probablement sans paiement intégré au tout premier jet. Les{" "}
            <Link href="/partenaires" style={{ fontWeight: 600 }}>
              partenariats
            </Link>{" "}
            et le terrain valideront si on le fait et comment.
          </p>
        </div>

        <p className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-ui-sm)", color: "var(--ptg-text-muted)" }}>
          L’idée reste simple : un prix clair pour toi, parfois un partenariat avec un lieu qui a envie de nous faire
          confiance, sans vendre ton attention à la sauvette.
        </p>

        <div className="ptg-stack ptg-stack--tight">
          <Link href="/accueil" className="ptg-btn-primary" style={{ textAlign: "center" }}>
            Retour accueil
          </Link>
          <Link href="/lieux" className="ptg-btn-ghost" style={{ textAlign: "center", textDecoration: "none" }}>
            Lieux & repères
          </Link>
        </div>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
