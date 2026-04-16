import type { ReactNode } from "react";
import { BrandScribbleBackdrop } from "@/components/BrandScribbleBackdrop";
import { PtgLandingDecor } from "@/components/PtgLandingDecor";

type Decor = "none" | "subtle";

/**
 * Colonne principale des écrans app : filigrane marque, traits culinaires, contenu.
 */
export function PtgAppFlow({
  children,
  decor = "subtle",
  brandScribbles = true,
}: {
  children: ReactNode;
  decor?: Decor;
  /** Filigrane « Paye ta graille » (désactiver sur écrans ultra sobres si besoin). */
  brandScribbles?: boolean;
}) {
  const showDecor = decor === "subtle";
  return (
    <div className="ptg-app-flow">
      {showDecor && brandScribbles ? <BrandScribbleBackdrop /> : null}
      {showDecor ? <PtgLandingDecor variant="subtle" /> : null}
      {children}
    </div>
  );
}
