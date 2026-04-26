import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { InviteRefBanner } from "@/components/InviteRefBanner";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { getPostLoginPath } from "@/lib/auth/post-login-path";
import { isSupabaseConfigured } from "@/lib/env-public";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { UX_BACK } from "@/lib/ux-copy";

export default async function OnboardingPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) redirect(await getPostLoginPath(supabase));
    }
  }

  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner" style={{ paddingBottom: "0.35rem" }}>
          <Link href="/" className="ptg-link-back">
            {UX_BACK.marketingHome}
          </Link>
        </div>
        <div className="ptg-page-inner" style={{ paddingBottom: "0" }}>
          <Suspense fallback={null}>
            <InviteRefBanner />
          </Suspense>
        </div>
        <OnboardingWizard />
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
