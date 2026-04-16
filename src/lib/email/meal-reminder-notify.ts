import { shouldNotifyByEmail } from "@/lib/email/notify-policy";
import { resendConfigured, sendResendEmail } from "@/lib/email/resend-send";
import { createServiceRoleClient } from "@/lib/supabase/admin";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const PARIS_TZ = "Europe/Paris";

/**
 * Rappel repas confirmé (J-24 ou ~2h avant `window_start`).
 * Même politique e-mail que les autres nudges : `nudge_level` off = pas d’e-mail ; silence nocturne Paris.
 * Ne consomme pas le quota « repas proposé » (transactionnel distinct).
 */
export async function notifyUserMealReminder(params: {
  userId: string;
  mealId: string;
  kind: "24h" | "2h";
  whenLabel: string;
}): Promise<void> {
  if (!resendConfigured()) return;

  const admin = createServiceRoleClient();
  if (!admin) return;

  const { data: settings, error: settingsErr } = await admin
    .from("user_settings")
    .select("nudge_level, nudge_quiet_start_hour, nudge_quiet_end_hour")
    .eq("user_id", params.userId)
    .maybeSingle();

  if (settingsErr && process.env.NODE_ENV !== "production") {
    console.warn("[meal-reminder-notify] user_settings:", settingsErr.message);
  }

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

  const { data: userData, error: userErr } = await admin.auth.admin.getUserById(params.userId);
  if (userErr || !userData.user.email?.trim()) return;

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "";
  const path = `/repas/${params.mealId}`;
  const link = site ? `${site}${path}` : path;

  const subject =
    params.kind === "24h"
      ? "Demain : ton repas Paye ta graille"
      : "Bientôt : ton repas Paye ta graille";

  const lead =
    params.kind === "24h"
      ? "Petit rappel : tu as un repas confirmé dans l’app."
      : "Ton repas approche : pense à prévenir l’autre personne si un imprévu survient.";

  const html = `<p>Bonjour,</p>
<p>${lead}</p>
<p><strong>Côté app</strong> : ${escapeHtml(params.whenLabel)}</p>
<p><a href="${escapeHtml(link)}">Ouvrir le repas</a></p>
<p style="font-size:12px;color:#666;">Moins de mails : <strong>Moi</strong> → <strong>Rappels</strong>.</p>`;

  const result = await sendResendEmail({
    to: userData.user.email.trim(),
    subject,
    html,
  });

  if (!result.ok && process.env.NODE_ENV !== "production") {
    console.warn("[meal-reminder-notify]", result.error);
  }
}
