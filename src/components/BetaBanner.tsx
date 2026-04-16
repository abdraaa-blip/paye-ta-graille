import { isPublicBeta } from "@/lib/public-beta";
import { UX_BETA } from "@/lib/ux-copy";

/** Affiche un bandeau discret si `NEXT_PUBLIC_PTG_PUBLIC_BETA=1` (calibrer les attentes en test). */
export function BetaBanner() {
  if (!isPublicBeta()) {
    return null;
  }

  return (
    <div role="status" className="ptg-beta-ribbon">
      {UX_BETA.ribbon}
    </div>
  );
}
