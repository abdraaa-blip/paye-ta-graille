import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { GROWTH_EVENT_NAMES } from "@/lib/growth-event-names";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";
import { verifyInviteLinkToken } from "@/lib/invite-link-token";
import { maybeCreateInviteLinkWelcomeNotification } from "@/lib/notifications/invite-link-welcome";
import { maybeCreateInviterReferralNotifications } from "@/lib/notifications/invite-referral";

const bodySchema = z.object({
  event: z.enum(GROWTH_EVENT_NAMES),
  context: z.string().min(1).max(80).optional(),
  metadata: z
    .record(z.string().max(80), z.unknown())
    .optional()
    .refine((v) => {
      if (!v) return true;
      const clone: Record<string, unknown> = { ...v };
      if (typeof clone.inv_token === "string") {
        if (clone.inv_token.length > 4800) return false;
        clone.inv_token = "[redacted]";
      }
      return JSON.stringify(clone).length <= 6000;
    }, "metadata too large"),
});

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = await rateLimitForUser(session.user.id, "growth_event_post", 60, 60_000);
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

  const { event, context, metadata: rawMetadata } = parsed.data;

  let metadataForInsert: Record<string, unknown> = rawMetadata ? { ...rawMetadata } : {};
  let inviterFromToken: string | null = null;
  let inviteSourceFromToken: string | null = null;

  if (event === "invite_attribution") {
    const invTok =
      rawMetadata && typeof (rawMetadata as { inv_token?: unknown }).inv_token === "string"
        ? (rawMetadata as { inv_token: string }).inv_token
        : null;
    if (invTok) {
      const verified = verifyInviteLinkToken(invTok);
      if (verified) {
        inviterFromToken = verified.inv;
        inviteSourceFromToken = verified.src;
      }
    }
    const { inv_token: _stripped, ...rest } = metadataForInsert;
    metadataForInsert = {
      ...rest,
      invite_signing: invTok ? (inviterFromToken ? "verified" : "invalid") : "absent",
    };
  }

  const { error } = await session.supabase.from("growth_events").insert({
    user_id: session.user.id,
    event_name: event,
    context: context ?? null,
    metadata: metadataForInsert,
  });

  if (error) {
    return jsonError("growth_event_failed", "Impossible d'enregistrer l'événement.", 500);
  }

  if (event === "invite_attribution") {
    void maybeCreateInviteLinkWelcomeNotification(session.user.id);
    if (inviterFromToken && inviterFromToken !== session.user.id) {
      void maybeCreateInviterReferralNotifications({
        inviterUserId: inviterFromToken,
        inviteeUserId: session.user.id,
        sourceLabel: inviteSourceFromToken ?? "invite",
      });
    }
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}
