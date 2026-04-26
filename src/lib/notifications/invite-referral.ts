import { GROWTH_INVITER_REFERRAL_IN_APP } from "@/lib/growth-copy";
import { createInAppNotifications } from "@/lib/notifications/in-app";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { notifyInviterReferralJoined } from "@/lib/email/invite-referral-notify";

const DEDUPE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Notif in-app (+ e-mail optionnel) pour l’inviteur quand un·e invité·e termine l’attribution.
 * Déduplication par couple (inviteur, invité·e) sur 7 jours.
 */
export async function maybeCreateInviterReferralNotifications(params: {
  inviterUserId: string;
  inviteeUserId: string;
  sourceLabel: string;
}): Promise<void> {
  const { inviterUserId, inviteeUserId, sourceLabel } = params;
  if (inviterUserId === inviteeUserId) return;

  const admin = createServiceRoleClient();
  if (!admin) return;

  const since = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();
  const { data: existing, error: exErr } = await admin
    .from("user_notifications")
    .select("id")
    .eq("user_id", inviterUserId)
    .eq("kind", "invite_referral_joined")
    .gte("created_at", since)
    .contains("meta", { invitee_id: inviteeUserId })
    .limit(1);

  if (exErr) return;
  if (existing && existing.length > 0) return;

  await createInAppNotifications([
    {
      userId: inviterUserId,
      kind: "invite_referral_joined",
      title: GROWTH_INVITER_REFERRAL_IN_APP.title,
      body: GROWTH_INVITER_REFERRAL_IN_APP.body,
      ctaHref: "/moi",
      metadata: { invitee_id: inviteeUserId, source: sourceLabel.slice(0, 80) },
    },
  ]);

  void notifyInviterReferralJoined({ inviterUserId });
}
