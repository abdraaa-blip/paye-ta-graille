import Link from "next/link";
import { PtgMenuCard } from "@/components/PtgMenuCard";

export function ModuleDisabledNotice({ title }: { title: string }) {
  return (
    <PtgMenuCard variant="mist" stamp="Bientôt">
      <div className="ptg-page-head">
        <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
          {title}
        </h1>
        <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
        <p className="ptg-type-body" style={{ margin: "0 0 1rem" }}>
          Ce volet n’est pas encore ouvert dans ton espace. On l’active progressivement pour garder une appli simple et sûre.
        </p>
        <Link href="/accueil" className="ptg-btn-primary" style={{ display: "inline-flex" }}>
          Retour accueil
        </Link>
      </div>
    </PtgMenuCard>
  );
}
