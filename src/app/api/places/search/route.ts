import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { googlePlacesApiKey } from "@/lib/places-google";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

const querySchema = z.object({
  q: z.string().min(2).max(120),
});

export async function GET(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = await rateLimitForUser(session.user.id, "places_search", 36, 60_000);
  if (limited) return limited;

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({ q: url.searchParams.get("q") ?? "" });
  if (!parsed.success) {
    return jsonError("validation_error", "Paramètre q requis (2–120 caractères).", 400);
  }

  const key = googlePlacesApiKey();
  if (!key) {
    return jsonError(
      "places_not_configured",
      "La recherche de lieux n’est pas disponible pour l’instant.",
      503,
    );
  }

  const gUrl = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  gUrl.searchParams.set("query", parsed.data.q);
  gUrl.searchParams.set("key", key);
  gUrl.searchParams.set("language", "fr");

  const res = await fetch(gUrl.toString(), { next: { revalidate: 0 } });
  if (!res.ok) {
    return jsonError("places_upstream_error", `Google HTTP ${res.status}`, 502);
  }

  const payload = (await res.json()) as {
    status: string;
    error_message?: string;
    results?: {
      place_id: string;
      name: string;
      formatted_address?: string;
      geometry?: { location?: { lat: number; lng: number } };
    }[];
  };

  if (payload.status !== "OK" && payload.status !== "ZERO_RESULTS") {
    return jsonError(
      "places_api_error",
      payload.error_message ?? payload.status,
      502,
    );
  }

  const results = (payload.results ?? []).slice(0, 12).map((r) => ({
    place_id: r.place_id,
    name: r.name,
    address: r.formatted_address ?? null,
    lat: r.geometry?.location?.lat ?? null,
    lng: r.geometry?.location?.lng ?? null,
  }));

  return NextResponse.json({ results });
}
