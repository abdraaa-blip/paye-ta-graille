import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export async function GET(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = await rateLimitForUser(session.user.id, "discover_get", 45, 60_000);
  if (limited) return limited;

  const url = new URL(request.url);
  const q = querySchema.safeParse({ limit: url.searchParams.get("limit") ?? undefined });
  if (!q.success) {
    return jsonError("validation_error", "Paramètre limit invalide.", 400);
  }

  const { data, error } = await session.supabase.rpc("discover_profiles", {
    p_limit: q.data.limit ?? 20,
  });

  if (error) {
    if (error.message.includes("discover_profiles") || error.code === "42883") {
      return jsonError(
        "rpc_missing",
        "Découverte indisponible pour l’instant. Réessaie plus tard.",
        503,
      );
    }
    return jsonError("discover_failed", "Impossible de charger la liste pour l’instant.", 500);
  }

  return NextResponse.json({ profiles: data ?? [] });
}
