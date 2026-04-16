import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

function makePlaceKey(input: { place_id?: string | null; name: string; address?: string | null }): string {
  const pid = input.place_id?.trim();
  if (pid) return `pid:${pid}`;
  const name = input.name.trim().toLowerCase();
  const addr = (input.address ?? "").trim().toLowerCase();
  return `na:${name}::${addr}`.slice(0, 320);
}

const postSchema = z
  .object({
    place_id: z.string().max(256).optional().nullable(),
    name: z.string().min(1).max(200),
    address: z.string().max(500).optional().nullable(),
    lat: z.number().finite().optional().nullable(),
    lng: z.number().finite().optional().nullable(),
    personal_score: z.number().int().min(1).max(5).optional().nullable(),
    would_return: z.boolean().optional().nullable(),
    private_note: z.string().max(500).optional().nullable(),
    recommend_public: z.boolean().optional(),
    last_meal_at: z.string().datetime().optional().nullable(),
  })
  .strict();

export async function GET(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(session.user.id, "places_memory_get", 60, 60_000);
  if (limited) return limited;

  const url = new URL(request.url);
  const placeId = url.searchParams.get("place_id")?.trim() ?? "";
  const name = url.searchParams.get("name")?.trim() ?? "";
  const address = url.searchParams.get("address")?.trim() ?? "";
  const includeSignals = url.searchParams.get("include_signals") === "1";

  if (placeId || name) {
    const placeKey = makePlaceKey({ place_id: placeId || null, name: name || placeId || "unknown", address: address || null });
    const { data, error } = await session.supabase
      .from("user_place_memories")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("place_key", placeKey)
      .maybeSingle();
    if (error) return jsonError("places_memory_fetch_failed", error.message, 400);
    if (!includeSignals) {
      return NextResponse.json({ memory: data ?? null });
    }
    const { data: signal, error: signalErr } = await session.supabase
      .from("place_reputation_signals")
      .select("place_key, name, address, public_reco_count, avg_public_score")
      .eq("place_key", placeKey)
      .maybeSingle();
    if (signalErr) return jsonError("places_signal_fetch_failed", signalErr.message, 400);
    return NextResponse.json({ memory: data ?? null, signal: signal ?? null });
  }

  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? "20"), 1), 50);
  const { data, error } = await session.supabase
    .from("user_place_memories")
    .select("*")
    .eq("user_id", session.user.id)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) return jsonError("places_memory_list_failed", error.message, 400);
  return NextResponse.json({ memories: data ?? [] });
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(session.user.id, "places_memory_post", 40, 60_000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", "Corps JSON invalide.", 400);
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", parsed.error.flatten().formErrors.join("; "), 400);
  }

  const place_key = makePlaceKey(parsed.data);
  const payload = {
    user_id: session.user.id,
    place_key,
    place_id: parsed.data.place_id ?? null,
    name: parsed.data.name,
    address: parsed.data.address ?? null,
    lat: parsed.data.lat ?? null,
    lng: parsed.data.lng ?? null,
    personal_score: parsed.data.personal_score ?? null,
    would_return: parsed.data.would_return ?? null,
    private_note: parsed.data.private_note ?? null,
    recommend_public: parsed.data.recommend_public ?? false,
    last_meal_at: parsed.data.last_meal_at ?? null,
  };

  const { data, error } = await session.supabase
    .from("user_place_memories")
    .upsert(payload, { onConflict: "user_id,place_key" })
    .select("*")
    .single();

  if (error) return jsonError("places_memory_upsert_failed", error.message, 400);
  return NextResponse.json({ memory: data });
}
