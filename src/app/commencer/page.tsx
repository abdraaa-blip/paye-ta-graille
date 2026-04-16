import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env-public";

type Search = Record<string, string | string[] | undefined>;

/**
 * Point d’entrée unique « Commencer » : auth si Supabase est prêt,
 * sinon parcours démo local (onboarding) pour tests UX immédiats.
 * Propage `ref=friend_*` des liens d’invitation vers `invite_ref` (auth / onboarding).
 */
export default async function CommencerPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const refRaw = sp.ref;
  const ref = Array.isArray(refRaw) ? refRaw[0] : refRaw;
  const dest = isSupabaseConfigured() ? "/auth" : "/onboarding";
  const invite =
    typeof ref === "string" && ref.startsWith("friend_") ? `?invite_ref=${encodeURIComponent(ref)}` : "";
  redirect(`${dest}${invite}`);
}
