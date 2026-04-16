import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";
import { pickSurpriseProfile } from "@/lib/surprise-match";

type DiscoverRow = {
  id: string;
  display_name: string;
  photo_url: string | null;
  city: string | null;
  social_intent: string;
  meal_intent: string;
  radius_km: number;
};

export async function GET() {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = await rateLimitForUser(session.user.id, "discover_surprise_get", 20, 60_000);
  if (limited) return limited;

  const { data: me, error: meErr } = await session.supabase
    .from("profiles")
    .select("meal_intent")
    .eq("id", session.user.id)
    .maybeSingle();

  if (meErr) {
    return jsonError("profile_read_failed", "Impossible de lire ton profil pour l’instant.", 500);
  }

  const { data: rows, error: discErr } = await session.supabase.rpc("discover_profiles", {
    p_limit: 50,
  });

  if (discErr) {
    if (discErr.message.includes("discover_profiles") || discErr.code === "42883") {
      return jsonError(
        "rpc_missing",
        "Découverte indisponible pour l’instant. Réessaie plus tard.",
        503,
      );
    }
    return jsonError("discover_failed", "Impossible de tirer au sort pour l’instant.", 500);
  }

  const list = (rows ?? []) as DiscoverRow[];
  const picked = pickSurpriseProfile(list, me?.meal_intent ?? null);

  if (!picked) {
    return NextResponse.json({ profile: null, compatible_strict: false });
  }

  return NextResponse.json({
    profile: picked.profile,
    compatible_strict: picked.compatibleStrict,
  });
}
