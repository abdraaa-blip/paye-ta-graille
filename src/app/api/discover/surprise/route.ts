import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";
import { pickSurpriseProfiles, sanitizeSurpriseExcludeIds } from "@/lib/surprise-match";

type DiscoverRow = {
  id: string;
  display_name: string;
  photo_url: string | null;
  city: string | null;
  social_intent: string;
  meal_intent: string;
  radius_km: number;
};

export async function GET(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = await rateLimitForUser(session.user.id, "discover_surprise_get", 20, 60_000);
  if (limited) return limited;

  const url = new URL(request.url);
  const excludeParam = url.searchParams.get("exclude");
  const excludeIds = sanitizeSurpriseExcludeIds(
    excludeParam ? excludeParam.split(",").map((s) => s.trim()) : undefined,
  );

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

  const uid = session.user.id;
  const list = ((rows ?? []) as DiscoverRow[]).filter((r) => r.id !== uid);
  const rolled = pickSurpriseProfiles(list, me?.meal_intent ?? null, { excludeIds, maxCount: 3 });

  if (!rolled || rolled.profiles.length === 0) {
    return NextResponse.json({ profiles: [], profile: null, compatible_strict: false });
  }

  const [primary] = rolled.profiles;
  return NextResponse.json({
    profiles: rolled.profiles,
    profile: primary,
    compatible_strict: rolled.compatibleStrict,
  });
}
