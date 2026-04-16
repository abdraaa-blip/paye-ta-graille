import { calendarDateInTimeZone } from "@/lib/email/paris-calendar";
import { shouldNotifyByEmail } from "@/lib/email/notify-policy";
import { resendConfigured, sendResendEmail } from "@/lib/email/resend-send";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const PARIS_TZ = "Europe/Paris";

async function releaseSlot(admin: SupabaseClient, userId: string, dayParis: string): Promise<void> {
  const { error } = await admin.rpc("release_meal_email_nudge_slot", {
    p_user_id: userId,
    p_day_paris: dayParis,
  });
  if (error && process.env.NODE_ENV !== "production") {
    console.warn("[meal-proposed-notify] release rpc:", error.message);
  }
}

/**
 * E-mail optionnel à l’invité·e quand un repas est proposé.
 * Respecte `nudge_level`, heures de silence, et `nudge_max_per_day` (réservation atomique jour Paris).
 * Ne bloque jamais la réponse HTTP du POST /api/meals.
 */
export async function notifyGuestMealProposed(params: {
  mealId: string;
  hostDisplayName: string;
  guestUserId: string;
}): Promise<void> {
  if (!resendConfigured()) return;

  const admin = createServiceRoleClient();
  if (!admin) return;

  const { data: settings, error: settingsErr } = await admin
    .from("user_settings")
    .select("nudge_level, nudge_quiet_start_hour, nudge_quiet_end_hour, nudge_max_per_day")
    .eq("user_id", params.guestUserId)
    .maybeSingle();

  if (settingsErr && process.env.NODE_ENV !== "production") {
    console.warn("[meal-proposed-notify] user_settings:", settingsErr.message);
  }

  const maxPerDay = settings && Number.isInteger(settings.nudge_max_per_day) ? settings.nudge_max_per_day : 1;
  if (maxPerDay <= 0) return;

  const nudgeLevel = settings?.nudge_level ?? "normal";
  const quietStart =
    settings && Number.isInteger(settings.nudge_quiet_start_hour)
      ? settings.nudge_quiet_start_hour
      : 22;
  const quietEnd =
    settings && Number.isInteger(settings.nudge_quiet_end_hour) ? settings.nudge_quiet_end_hour : 8;

  if (
    !shouldNotifyByEmail({
      nudgeLevel,
      quietStartHour: quietStart,
      quietEndHour: quietEnd,
      timeZone: PARIS_TZ,
    })
  ) {
    return;
  }

  const todayParis = calendarDateInTimeZone(new Date(), PARIS_TZ);

  const { data: reserved, error: reserveErr } = await admin.rpc("reserve_meal_email_nudge_slot", {
    p_user_id: params.guestUserId,
    p_day_paris: todayParis,
  });

  if (reserveErr) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[meal-proposed-notify] reserve rpc:", reserveErr.message);
    }
    return;
  }
  if (reserved !== true) return;

  const { data: userData, error: userErr } = await admin.auth.admin.getUserById(params.guestUserId);
  if (userErr || !userData.user.email?.trim()) {
    await releaseSlot(admin, params.guestUserId, todayParis);
    return;
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "";
  const path = `/repas/${params.mealId}`;
  const link = site ? `${site}${path}` : path;

  const host = escapeHtml(params.hostDisplayName.trim() || "Un membre");
  const subject = `${params.hostDisplayName.trim() || "Un membre"} t’a proposé un repas · Paye ta graille`;
  const html = `<p>Bonjour,</p>
<p><strong>${host}</strong> t’a proposé un repas sur Paye ta graille.</p>
<p><a href="${escapeHtml(link)}">Ouvrir le repas dans l’app</a></p>
<p style="font-size:12px;color:#666;">Tu peux réduire ou couper ces rappels dans l’app : <strong>Moi</strong> → <strong>Rappels</strong>.</p>`;

  const result = await sendResendEmail({
    to: userData.user.email.trim(),
    subject,
    html,
  });

  if (!result.ok) {
    await releaseSlot(admin, params.guestUserId, todayParis);
    if (process.env.NODE_ENV !== "production") {
      console.warn("[meal-proposed-notify]", result.error);
    }
  }
}
