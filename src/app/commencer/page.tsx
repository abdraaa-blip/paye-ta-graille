import { redirect } from "next/navigation";
import { PTG_AUTH_PATH } from "@/lib/auth/auth-path";
import { getPostLoginPath } from "@/lib/auth/post-login-path";
import { isSupabaseConfigured } from "@/lib/env-public";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Search = Record<string, string | string[] | undefined>;

function firstParam(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

/**
 * Point d’entrée « Commencer » : si déjà connecté·e → même destination qu’après login.
 * Sinon auth si Supabase est prêt, sinon parcours démo (onboarding).
 * Propage `ref=friend_*` → `invite_ref` et `inv` (jeton signé inviteur) vers auth / onboarding / post-login.
 */
export default async function CommencerPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const ref = firstParam(sp.ref);
  const invite =
    typeof ref === "string" && ref.startsWith("friend_") ? `invite_ref=${encodeURIComponent(ref)}` : "";
  const invRaw = firstParam(sp.inv);
  const inv =
    typeof invRaw === "string" && invRaw.length >= 24 && invRaw.length <= 4800
      ? `inv=${encodeURIComponent(invRaw)}`
      : "";
  const q = [invite, inv].filter(Boolean).join("&");
  const suffix = q ? `?${q}` : "";

  if (!isSupabaseConfigured()) {
    redirect(`/onboarding${suffix}`);
  }

  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      let dest = await getPostLoginPath(supabase);
      if (q) dest = dest.includes("?") ? `${dest}&${q}` : `${dest}?${q}`;
      redirect(dest);
    }
  }

  redirect(`${PTG_AUTH_PATH}${suffix}`);
}
