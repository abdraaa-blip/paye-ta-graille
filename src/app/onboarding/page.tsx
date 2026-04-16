import Link from "next/link";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";

export default function OnboardingPage() {
  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner" style={{ paddingBottom: "0.35rem" }}>
          <Link href="/" className="ptg-link-back">
            ← Accueil site
          </Link>
        </div>
        <OnboardingWizard />
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
