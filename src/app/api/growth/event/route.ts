import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

const eventNames = [
  "ritual_card_seen",
  "ritual_card_click",
  "next_action_click",
  "invite_share_opened",
  "invite_link_copied",
  "invite_native_shared",
  "discover_propose_click",
  "repas_refresh_click",
  "nudge_level_updated",
  "module_share_publish",
  "module_share_reserve",
  "module_rescue_publish",
  "module_rescue_claim",
  "module_payment_checkout_start",
  "lieux_search",
  "lieux_nearby_click",
  "lieux_place_picked",
  "lieux_maps_open",
  "lieux_copy_place",
  "lieux_memory_save",
  "lieux_memory_optin_public",
] as const;

const bodySchema = z.object({
  event: z.enum(eventNames),
  context: z.string().min(1).max(80).optional(),
  metadata: z
    .record(z.string().max(80), z.unknown())
    .optional()
    .refine((v) => !v || JSON.stringify(v).length <= 2000, "metadata too large"),
});

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(session.user.id, "growth_event_post", 60, 60_000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", "Corps JSON invalide.", 400);
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", "Événement invalide.", 400);
  }

  const { event, context, metadata } = parsed.data;
  const { error } = await session.supabase.from("growth_events").insert({
    user_id: session.user.id,
    event_name: event,
    context: context ?? null,
    metadata: metadata ?? {},
  });

  if (error) {
    return jsonError("growth_event_failed", "Impossible d'enregistrer l'événement.", 500);
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}
