import { createServiceRoleClient } from "@/lib/supabase/admin";

export type InAppNotificationInput = {
  userId: string;
  kind:
    | "meal_proposed"
    | "meal_reminder_24h"
    | "meal_reminder_2h"
    | "meal_auto_completed"
    | "report_received"
    | "growth_feedback_alert"
    | "growth_daily_digest"
    | "growth_weekly_digest"
    | "invite_link_welcome"
    | "invite_referral_joined";
  title: string;
  body: string;
  ctaHref?: string | null;
  metadata?: Record<string, unknown> | null;
};

/**
 * Crée des notifications in-app pour un ou plusieurs utilisateurs.
 * Utilise la service role (RLS bypass) et ne doit jamais casser le flux appelant.
 */
export async function createInAppNotifications(entries: InAppNotificationInput[]): Promise<void> {
  if (entries.length === 0) return;
  const admin = createServiceRoleClient();
  if (!admin) return;

  const rows = entries.map((e) => ({
    user_id: e.userId,
    kind: e.kind,
    title: e.title.trim().slice(0, 140),
    body: e.body.trim().slice(0, 1200),
    cta_href: e.ctaHref?.trim() || null,
    meta: e.metadata ?? {},
  }));

  const { error } = await admin.from("user_notifications").insert(rows);
  if (error && process.env.NODE_ENV !== "production") {
    console.warn("[in-app-notifications]", error.message);
  }
}
