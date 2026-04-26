"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthPromptLink } from "@/components/AuthPromptLink";
import { clearOptionalLocalCachesOnSignOut } from "@/lib/auth/local-browser-cleanup";
import { useSupabaseSession } from "@/lib/auth/use-supabase-session";
import { UX_HOME, UX_SESSION } from "@/lib/ux-copy";

export function HomeHeroAuthActions({ initialSignedIn }: { initialSignedIn: boolean }) {
  const router = useRouter();
  const { supabase, sessionActive, ready } = useSupabaseSession();
  const [signingOut, setSigningOut] = useState(false);

  const signedIn = useMemo(
    () => sessionActive || (!ready && initialSignedIn),
    [sessionActive, ready, initialSignedIn],
  );

  async function signOut() {
    if (!supabase) return;
    setSigningOut(true);
    await supabase.auth.signOut();
    clearOptionalLocalCachesOnSignOut();
    setSigningOut(false);
    router.refresh();
  }

  if (supabase && signedIn) {
    return (
      <div className="ptg-stack ptg-stack--roomy ptg-guide-press-cycle ptg-motion-profile-subtle">
        <Link href="/accueil" className="ptg-btn-primary ptg-guide-press" style={{ textAlign: "center" }}>
          {UX_HOME.ctaSignedInApp}
        </Link>
        <button
          type="button"
          className="ptg-btn-secondary ptg-guide-press"
          disabled={signingOut}
          onClick={() => void signOut()}
        >
          {signingOut ? UX_SESSION.signOutBusy : UX_SESSION.signOut}
        </button>
      </div>
    );
  }

  return (
    <div className="ptg-stack ptg-stack--roomy ptg-guide-press-cycle ptg-motion-profile-subtle">
      <Link href="/commencer" className="ptg-btn-primary ptg-guide-press" style={{ textAlign: "center" }}>
        {UX_HOME.ctaPrimary}
      </Link>
      <AuthPromptLink className="ptg-btn-secondary ptg-guide-press" />
    </div>
  );
}
