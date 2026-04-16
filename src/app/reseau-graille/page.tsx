import type { Metadata } from "next";
import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { SiteFooter } from "@/components/SiteFooter";
import {
  COMPANIONS_FUN_KICKER,
  COMPANIONS_GAUGE_LEVELS,
  COMPANIONS_MICRO,
  COMPANIONS_NAV_LABEL,
  COMPANIONS_ZONE_PLAYFUL_EXPLAIN,
  COMPANIONS_ZONE_PLAYFUL_NAME,
} from "@/lib/companions-copy";
import { NUDGES_PAIR_SOFT } from "@/lib/micro-moments-copy";
import { JAUGE_RELATION_LINES } from "@/lib/micro-moments-copy";

export const metadata: Metadata = {
  title: COMPANIONS_NAV_LABEL,
  description: `${COMPANIONS_ZONE_PLAYFUL_NAME} : ${COMPANIONS_MICRO.noSwipe} Lien de table privé, repas croisés, sans classement public.`,
};

export default function ReseauGraillePage() {
  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
        <AppNav current="reseau" />
        <PtgMenuCard variant="kin" stamp="Après table">
          <div className="ptg-page-head">
            <p
              style={{
                margin: "0 0 0.2rem",
                fontSize: "var(--ptg-text-2xs)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ptg-text-muted)",
              }}
            >
              {COMPANIONS_ZONE_PLAYFUL_NAME}
            </p>
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.35rem" }}>
              {COMPANIONS_NAV_LABEL}
            </h1>
            <div className="ptg-accent-rule" style={{ margin: "0 0 0.75rem" }} />
            <p className="ptg-type-body" style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-ui-sm)", lineHeight: 1.5 }}>
              {COMPANIONS_ZONE_PLAYFUL_EXPLAIN}
            </p>
            <p
              style={{
                margin: "0 0 0.75rem",
                fontSize: "var(--ptg-text-md-sm)",
                fontWeight: 600,
                color: "var(--ptg-text-muted)",
                lineHeight: 1.4,
              }}
            >
              {COMPANIONS_FUN_KICKER}
            </p>
            <p className="ptg-type-body" style={{ margin: "0 0 1rem" }}>
              {COMPANIONS_MICRO.noSwipe} {COMPANIONS_MICRO.realPeople} Ce n’est pas un fil de profils : c’est une{" "}
              <strong>mémoire des repas</strong> que tu as vécus en vrai. Chaque personne ici, c’est quelqu’un avec qui tu as
              partagé un moment à table. Et demain, si tu le souhaites, un moyen discret de dire « on remet ça ».
            </p>
          </div>
        </PtgMenuCard>

        <h2 style={{ fontSize: "var(--ptg-text-base)", fontWeight: 700, margin: "1.25rem 0 0.5rem" }}>Trois idées, une même table</h2>
        <ol className="ptg-type-body ptg-prose-list ptg-prose-list--md" style={{ margin: "0 0 1rem" }}>
          <li>
            <strong>Rencontre</strong> : deux personnes partagent une table (déjà dans l’app).
          </li>
          <li>
            <strong>Lien</strong> : si le repas s’est bien passé, ajout en contact privé, sans pression (« on se revoit à
            manger » ou silence).
          </li>
          <li>
            <strong>Repas croisé</strong> : une même personne peut inviter deux compagnons qui ne se connaissent pas,
            toujours dans le cadre d’un vrai repas, sans exposer tout un graphe social.
          </li>
        </ol>

        <h2 style={{ fontSize: "var(--ptg-text-base)", fontWeight: 700, margin: "1.25rem 0 0.5rem" }}>
          Jauge « lien de table » (privée)
        </h2>
        <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)" }}>
          Plus vous terminez des repas <strong>ensemble</strong>, plus le lien se renforce, au fil des tables, pas à cause
          des messages. Visible seulement entre vous deux, jamais en leaderboard.
        </p>
        <div className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)", fontWeight: 700 }}>Des repas qui laissent une trace (entre vous)</p>
          <ul className="ptg-type-body ptg-prose-list ptg-prose-list--sm" style={{ margin: 0 }}>
            {COMPANIONS_GAUGE_LEVELS.map((row) => (
              <li key={row.label}>
                <strong>{row.range}</strong> : {row.label}
                {row.note ? ` (${row.note})` : ""}
              </li>
            ))}
          </ul>
          <p style={{ margin: "0.75rem 0 0.35rem", fontSize: "var(--ptg-text-xs)", fontWeight: 700, color: "var(--ptg-text-muted)" }}>
            Exemples de phrases (jauge privée)
          </p>
          <ul className="ptg-type-body ptg-prose-list ptg-prose-list--xs" style={{ margin: 0 }}>
            {JAUGE_RELATION_LINES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: "0 0 0.5rem", fontWeight: 700 }}>Petits rappels (réglables, pas du spam)</p>
          <p className="ptg-type-body" style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)", lineHeight: 1.6 }}>
            Exemples :{" "}
            {NUDGES_PAIR_SOFT.map((s, i) => (
              <span key={s}>
                {i > 0 ? " · " : ""}« {s} »
              </span>
            ))}
            . Peu souvent, zéro culpabilité.
          </p>
        </div>

        <p className="ptg-banner" style={{ marginBottom: "1rem", fontSize: "var(--ptg-text-ui-sm)" }}>
          <strong>Règle d’or</strong> : ça doit rester <strong>naturel</strong>. Pas de score public, pas de compétition
          entre utilisateurs.
        </p>

        <p className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
          En résumé : repas → souvenir réel → lien discret → envie de remettre ça.
        </p>

        <div className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: "0 0 0.5rem", fontWeight: 700 }}>Invitation croisée</p>
          <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-ui-sm)", lineHeight: 1.6 }}>
            Exemple : A a mangé avec B et avec C ; B et C ne se connaissent pas. A peut proposer un repas à trois. Chacun
            ne voit que le contexte du repas, pas le « réseau complet » de l’autre.
          </p>
        </div>

        <h2 style={{ fontSize: "var(--ptg-text-base)", fontWeight: 700, margin: "0 0 0.5rem" }}>À venir</h2>
        <ul className="ptg-type-body ptg-prose-list" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-ui-sm)" }}>
          <li>
            Après un repas : mise à jour du lien de table, option pour garder la personne dans{" "}
            <strong>{COMPANIONS_NAV_LABEL.toLowerCase()}</strong>, proposer un prochain repas, ou ne rien faire.
          </li>
          <li>
            Liste simple : les personnes avec qui tu as mangé, pas un fil d’actus.
          </li>
          <li>
            Suggestion du type « vous avez des repas en commun » + organiser un repas croisé.
          </li>
        </ul>

        <p className="ptg-banner" style={{ marginBottom: "1rem" }}>
          <strong>Ça arrive.</strong> Tu peux déjà vivre les repas dans l’app ; la liste des compagnons de table et les petits
          rappels doux suivront quand on aura le temps de les faire aussi bien qu’ils le méritent.
        </p>

        <div className="ptg-stack ptg-stack--tight">
          <Link href="/repas" className="ptg-btn-primary" style={{ textAlign: "center" }}>
            Mes repas
          </Link>
          <Link href="/accueil" className="ptg-btn-ghost" style={{ textAlign: "center", textDecoration: "none" }}>
            Accueil
          </Link>
        </div>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
