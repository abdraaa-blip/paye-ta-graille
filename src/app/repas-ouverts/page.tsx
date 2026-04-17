import type { Metadata } from "next";
import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { NightStageDecor } from "@/components/NightStageDecor";
import { SiteFooter } from "@/components/SiteFooter";
import { GROWTH_REPAS_OUVERTS_SLOGAN } from "@/lib/growth-copy";

export const metadata: Metadata = {
  title: "Repas ouverts",
  description:
    "Fil à venir : qui mange où, quand, et qui est chaud maintenant : repas spontanés et tables ouvertes.",
};

export default function RepasOuvertsPage() {
  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
        <AppNav />
        <PtgMenuCard variant="mist" stamp="Au fil">
          <div className="ptg-page-head">
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              Repas ouverts
            </h1>
            <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
            <p
              className="ptg-type-body"
              style={{
                margin: "0 0 0.65rem",
                fontSize: "var(--ptg-text-md-sm)",
                fontWeight: 700,
                lineHeight: 1.35,
                color: "var(--ptg-accent-deep)",
              }}
            >
              {GROWTH_REPAS_OUVERTS_SLOGAN}
            </p>
            <p className="ptg-type-body" style={{ margin: "0 0 0" }}>
              Ici, à terme, tu verras <strong>qui a envie de manger</strong>, <strong>quand</strong>, et <strong>où</strong> : des
              envies du moment, des tables un peu ouvertes, du spontané, <strong>sans</strong> tourner ça en appli de drague.
            </p>
          </div>
        </PtgMenuCard>
        <div className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)", fontWeight: 700 }}>Ce que tu pourras faire ici</p>
          <ul className="ptg-type-body ptg-prose-list ptg-prose-list--sm" style={{ margin: 0 }}>
            <li>
              <strong>Qui mange maintenant</strong> : un petit signal, lieu public, toujours volontaire.
            </li>
            <li>
              <strong>Qui est dispo</strong> : un créneau large ça va (ce soir, ce week-end).
            </li>
            <li>
              <strong>Spontané</strong> : une envie (« raclette », « tester ce resto »), des places à compléter.
            </li>
          </ul>
        </div>
        <p className="ptg-banner" style={{ marginBottom: "1rem" }}>
          <strong>Pas encore ouvert.</strong> On préfère attendre d’avoir une vraie modération et des règles claires plutôt
          que d’afficher un fil vide ou bidon. Patience : le repas privé fonctionne déjà.
        </p>
        <p className="ptg-type-body" style={{ margin: "0 0 1.25rem", fontSize: "var(--ptg-text-md-sm)" }}>
          En attendant, passe par un <strong>repas privé</strong> (1 à 1 ou petit groupe) avec intentions claires.
        </p>
        <div className="ptg-stack ptg-stack--tight">
          <Link href="/decouvrir" className="ptg-btn-primary" style={{ textAlign: "center" }}>
            Repas privé : autour de toi
          </Link>
          <Link href="/experiences" className="ptg-btn-ghost" style={{ textAlign: "center", textDecoration: "none" }}>
            Expériences à venir
          </Link>
          <Link href="/accueil" className="ptg-btn-ghost" style={{ textAlign: "center", textDecoration: "none" }}>
            Retour accueil
          </Link>
        </div>
        <NightStageDecor />
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
