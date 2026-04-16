import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Même règle que `/auth/callback` : profil incomplet → compléter avant l’accueil.
 * Partagé client / serveur pour éviter deux vérités divergentes.
 */
export async function getPostLoginPath(supabase: SupabaseClient): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "/accueil";
  const { data: profile } = await supabase.from("profiles").select("city, display_name").eq("id", user.id).maybeSingle();
  const cityOk = Boolean(profile?.city?.trim());
  const nameOk = Boolean(profile?.display_name?.trim() && profile.display_name.trim().length >= 2);
  return !cityOk || !nameOk ? "/profil?setup=1" : "/accueil";
}
