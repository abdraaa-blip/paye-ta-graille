import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env-public";

/**
 * Point d’entrée unique « Commencer » : auth si Supabase est prêt,
 * sinon parcours démo local (onboarding) pour tests UX immédiats.
 */
export default function CommencerPage() {
  redirect(isSupabaseConfigured() ? "/auth" : "/onboarding");
}
