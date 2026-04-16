import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NouveauRepasForm } from "./NouveauRepasForm";
import { UX_NOUVEAU_REPAS } from "@/lib/ux-copy";

type Props = { searchParams: Promise<{ guest?: string }> };

export default async function NouveauRepasPage({ searchParams }: Props) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/auth");
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  const sp = await searchParams;
  const guest = sp.guest?.trim();
  if (!guest || guest === user.id) {
    return (
      <div className="ptg-page">
        <PtgAppFlow>
          <div className="ptg-page-inner">
            <AppNav />
            <div className="ptg-page-head">
              <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
                {UX_NOUVEAU_REPAS.title}
              </h1>
              <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
              <p className="ptg-type-body" style={{ margin: "0 0 0" }}>
                {UX_NOUVEAU_REPAS.needGuest}
              </p>
            </div>
            <p className="ptg-banner ptg-banner-warn" style={{ marginBottom: "1rem" }}>
              {UX_NOUVEAU_REPAS.warnGuest}
            </p>
            <div className="ptg-stack ptg-stack--compact">
              <Link href="/decouvrir" className="ptg-btn-primary" style={{ textAlign: "center" }}>
                {UX_NOUVEAU_REPAS.ctaDiscover}
              </Link>
              <Link href="/profil" style={{ fontSize: "var(--ptg-text-ui-sm)", textAlign: "center" }}>
                {UX_NOUVEAU_REPAS.checkProfil}
              </Link>
            </div>
          </div>
        </PtgAppFlow>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="ptg-page">
      <NouveauRepasForm guestId={guest} />
      <SiteFooter />
    </div>
  );
}
