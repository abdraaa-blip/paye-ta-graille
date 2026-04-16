import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { googlePlacesApiKey } from "@/lib/places-google";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

const querySchema = z.object({
  lat: z.coerce.number().gte(-90).lte(90),
  lng: z.coerce.number().gte(-180).lte(180),
  radius: z.coerce.number().int().min(200).max(50000).optional(),
});

export async function GET(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(session.user.id, "places_nearby", 20, 60_000);
  if (limited) return limited;

  const u = new URL(request.url);
  const parsed = querySchema.safeParse({
    lat: u.searchParams.get("lat"),
    lng: u.searchParams.get("lng"),
    radius: u.searchParams.get("radius") ?? undefined,
  });
  if (!parsed.success) {
    return jsonError(
      "validation_error",
      "Paramètres lat, lng requis (et radius optionnel 200–50000 m).",
      400,
    );
  }

  const key = googlePlacesApiKey();
  if (!key) {
    return jsonError(
      "places_not_configured",
      "La recherche de lieux n’est pas disponible pour l’instant.",
      503,
    );
  }

  const radius = parsed.data.radius ?? 1200;
  const gUrl = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
  gUrl.searchParams.set("location", `${parsed.data.lat},${parsed.data.lng}`);
  gUrl.searchParams.set("radius", String(radius));
  gUrl.searchParams.set("type", "restaurant");
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
      vicinity?: string;
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

  const results = (payload.results ?? []).slice(0, 15).map((r) => ({
    place_id: r.place_id,
    name: r.name,
    address: r.vicinity ?? null,
    lat: r.geometry?.location?.lat ?? null,
    lng: r.geometry?.location?.lng ?? null,
  }));

  return NextResponse.json({ results });
}
