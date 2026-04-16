import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { jsonError } from "./errors";

export type SessionResult =
  | { ok: true; supabase: SupabaseClient; user: User }
  | { ok: false; response: NextResponse };

export async function requireSession(): Promise<SessionResult> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      response: jsonError(
        "service_unavailable",
        "Service temporairement indisponible. Réessaie plus tard.",
        503,
      ),
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      response: jsonError("unauthorized", "Authentification requise.", 401),
    };
  }

  return { ok: true, supabase, user };
}
