import Link from "next/link";
import { PtgMenuCard } from "@/components/PtgMenuCard";

export function ModuleDisabledNotice({
  title,
  devHint,
}: {
  title: string;
  /** Affiché sous le texte principal (ex. variables pour activer un module en test). */
  devHint?: string;
}) {
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
        {devHint && (
          <p
            className="ptg-type-body"
            style={{
              margin: "0 0 1rem",
              fontSize: "var(--ptg-text-ui-sm)",
              color: "var(--ptg-text-muted)",
              lineHeight: 1.55,
            }}
          >
            {devHint}
          </p>
        )}
        <Link href="/graille-plus" className="ptg-btn-ghost" style={{ display: "inline-flex", marginRight: "0.75rem", textDecoration: "none" }}>
          Graille+
        </Link>
        <Link href="/accueil" className="ptg-btn-primary" style={{ display: "inline-flex" }}>
          Retour accueil
        </Link>
      </div>
    </PtgMenuCard>
  );
}
