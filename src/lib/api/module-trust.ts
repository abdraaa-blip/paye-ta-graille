import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { jsonError } from "./errors";
import type { NextResponse } from "next/server";

export type ModuleTrustProfile = {
  city: string;
  display_name: string;
  photo_url: string | null;
};

export type ModuleTrustResult =
  | { ok: true; profile: ModuleTrustProfile }
  | { ok: false; response: NextResponse };

/** Serveur uniquement. `0` / `false` = ne pas exiger `email_confirmed_at` (staging, OAuth edge cases). Défaut : strict. */
function moduleRequireVerifiedEmail(): boolean {
  const v = process.env.PTG_MODULE_REQUIRE_VERIFIED_EMAIL;
  if (v === "0" || v?.toLowerCase() === "false") return false;
  return true;
}

/**
 * Modules Graille+ : email vérifié (sauf si PTG_MODULE_REQUIRE_VERIFIED_EMAIL=0) + profil minimal (ville + pseudo).
 * Réduit abus et aligne le discours « comptes validés » sans KYC bancaire.
 */
export async function requireModuleTrust(user: User, supabase: SupabaseClient): Promise<ModuleTrustResult> {
  if (moduleRequireVerifiedEmail() && !user.email_confirmed_at) {
    return {
      ok: false,
      response: jsonError(
        "email_unverified",
        "Confirme ton adresse e-mail (lien reçu à l’inscription) pour utiliser ce module.",
        403,
      ),
    };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("city, display_name, photo_url")
    .eq("id", user.id)
    .maybeSingle();

  const city = profile?.city?.trim();
  const name = profile?.display_name?.trim();
  if (error || !profile || !city || !name) {
    return {
      ok: false,
      response: jsonError(
        "profile_incomplete",
        "Complète ton profil (pseudo et ville) pour utiliser ce module.",
        400,
      ),
    };
  }

  return {
    ok: true,
    profile: { city, display_name: name, photo_url: profile.photo_url ?? null },
  };
}
