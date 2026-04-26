import { GROWTH_INVITE_IN_APP } from "@/lib/growth-copy";
import { createInAppNotifications } from "@/lib/notifications/in-app";
import { createServiceRoleClient } from "@/lib/supabase/admin";

const DEDUPE_WINDOW_MS = 3_600_000;

/** Une notif in-app après enregistrement fiable du lien d’invitation (évite doublons si retry client). */
export async function maybeCreateInviteLinkWelcomeNotification(userId: string): Promise<void> {
  const admin = createServiceRoleClient();
  if (!admin) return;
  const since = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();
  const { data, error } = await admin
    .from("user_notifications")
    .select("id")
    .eq("user_id", userId)
    .eq("kind", "invite_link_welcome")
    .gte("created_at", since)
    .limit(1);
  if (error || (data && data.length > 0)) return;
  await createInAppNotifications([
    {
      userId,
      kind: "invite_link_welcome",
      title: GROWTH_INVITE_IN_APP.title,
      body: GROWTH_INVITE_IN_APP.body,
      ctaHref: "/decouvrir",
      metadata: { source: "invite_attribution" },
    },
  ]);
}
