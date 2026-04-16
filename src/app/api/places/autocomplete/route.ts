import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { googlePlacesApiKey } from "@/lib/places-google";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

const querySchema = z.object({
  input: z.string().min(2).max(120),
});

export async function GET(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(session.user.id, "places_autocomplete", 40, 60_000);
  if (limited) return limited;

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({ input: url.searchParams.get("input") ?? "" });
  if (!parsed.success) {
    return jsonError("validation_error", "Paramètre input requis (2–120 caractères).", 400);
  }

  const key = googlePlacesApiKey();
  if (!key) {
    return jsonError(
      "places_not_configured",
      "La recherche de lieux n’est pas disponible pour l’instant.",
      503,
    );
  }

  const gUrl = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  gUrl.searchParams.set("input", parsed.data.input);
  gUrl.searchParams.set("key", key);
  gUrl.searchParams.set("language", "fr");

  const res = await fetch(gUrl.toString(), { next: { revalidate: 0 } });
  if (!res.ok) {
    return jsonError("places_upstream_error", `Google HTTP ${res.status}`, 502);
  }

  const payload = (await res.json()) as {
    status: string;
    error_message?: string;
    predictions?: { description: string; place_id: string }[];
  };

  if (payload.status !== "OK" && payload.status !== "ZERO_RESULTS") {
    return jsonError(
      "places_api_error",
      payload.error_message ?? payload.status,
      502,
    );
  }

  const predictions = (payload.predictions ?? []).slice(0, 10).map((p) => ({
    description: p.description,
    place_id: p.place_id,
  }));

  return NextResponse.json({ predictions });
}
