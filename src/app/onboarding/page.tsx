import Link from "next/link";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { UX_BACK } from "@/lib/ux-copy";

export default function OnboardingPage() {
  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner" style={{ paddingBottom: "0.35rem" }}>
          <Link href="/" className="ptg-link-back">
            {UX_BACK.marketingHome}
          </Link>
        </div>
        <OnboardingWizard />
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
