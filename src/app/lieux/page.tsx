import type { Metadata } from "next";
import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Lieux",
  description:
    "Choisir un lieu pour manger ensemble : repas, invitations, tables entre humains (Paye ta graille).",
};

export default function LieuxPage() {
  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
          <AppNav />
          <div className="ptg-page-head">
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              Lieux
            </h1>
            <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
            <p className="ptg-type-body" style={{ margin: "0 0 1rem", lineHeight: 1.55 }}>
            Ici, un lieu ne se « like » pas dans le vide : il sert à <strong>un vrai repas</strong> avec quelqu’un ou un petit
            groupe. Tu cherches un resto ou un café <strong>au moment où tu organises la table</strong>, pas un catalogue
            interminable de réservations.
          </p>
          <p className="ptg-type-body" style={{ margin: "0 0 1.25rem", lineHeight: 1.55, color: "var(--ptg-text-muted)" }}>
            Tu peux taper un nom, te laisser guider par des suggestions, voir ce qui est <strong>près de toi</strong> si tu
            acceptes la position du navigateur, et parfois <strong>voir les adresses sur une carte</strong> pour te repérer
            d’un coup d’œil. Ensuite, tu valides avec ton invité ou ton groupe, comme dans la vie.
            </p>
          </div>
          <ul className="ptg-type-body ptg-prose-list" style={{ margin: "0 0 1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Où ça se passe ?</strong> Dans <strong>Mes repas</strong>, sur le repas concerné, quand c’est à ton rôle
              de proposer ou d’ajuster le lieu.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Pas de pression</strong> : tu peux toujours saisir le nom et l’adresse à la main si tu préfères.
            </li>
            <li>
              <strong>Plus tard</strong> : un coin pour flâner les bonnes tables (envies, budget, curiosité), sans devenir
              une appli de résa comme les autres.
            </li>
          </ul>
          <div className="ptg-stack ptg-stack--tight">
            <Link href="/decouvrir" className="ptg-btn-primary" style={{ textAlign: "center" }}>
              Trouver quelqu’un pour manger
            </Link>
            <Link href="/repas" className="ptg-btn-ghost" style={{ textAlign: "center", textDecoration: "none" }}>
              Mes repas
            </Link>
            <Link href="/accueil" style={{ textAlign: "center", fontSize: "var(--ptg-text-ui-sm)", color: "var(--ptg-text-muted)" }}>
              ← Accueil
            </Link>
          </div>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
