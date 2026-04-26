import { shouldNotifyByEmail } from "@/lib/email/notify-policy";
import { resendConfigured, sendResendEmail } from "@/lib/email/resend-send";
import { createServiceRoleClient } from "@/lib/supabase/admin";

const PARIS_TZ = "Europe/Paris";

/**
 * E-mail optionnel « quelqu’un a rejoint via ton lien » — respecte calme / silence (même logique que les repas).
 */
export async function notifyInviterReferralJoined(params: { inviterUserId: string }): Promise<void> {
  if (!resendConfigured()) return;

  const admin = createServiceRoleClient();
  if (!admin) return;

  const { data: settings } = await admin
    .from("user_settings")
    .select("nudge_level, nudge_quiet_start_hour, nudge_quiet_end_hour")
    .eq("user_id", params.inviterUserId)
    .maybeSingle();

  const nudgeLevel = settings?.nudge_level ?? "normal";
  const quietStart =
    settings && Number.isInteger(settings.nudge_quiet_start_hour) ? settings.nudge_quiet_start_hour : 22;
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

  const { data: userData, error: userErr } = await admin.auth.admin.getUserById(params.inviterUserId);
  if (userErr || !userData.user.email?.trim()) return;

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "";
  const link = site ? `${site}/moi` : "/moi";
  const subject = "Quelqu’un a rejoint Paye ta graille via ton lien";

  const html = `<p>Bonjour,</p>
<p>Une personne vient de finaliser son arrivée sur <strong>Paye ta graille</strong> avec <strong>ton lien d’invitation</strong>.</p>
<p><a href="${link}">Ouvrir l’app — onglet Moi</a> pour le détail des notifications.</p>
<p style="font-size:12px;color:#666;">Tu peux ajuster les e-mails dans l’app : <strong>Moi</strong> → <strong>Rappels</strong>.</p>`;

  const result = await sendResendEmail({
    to: userData.user.email.trim(),
    subject,
    html,
  });

  if (!result.ok && process.env.NODE_ENV !== "production") {
    console.warn("[invite-referral-notify]", result.error);
  }
}
