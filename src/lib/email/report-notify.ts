import { resendConfigured, sendResendEmail } from "@/lib/email/resend-send";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseRecipients(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return [...new Set(raw.split(",").map((v) => v.trim()).filter(Boolean))];
}

type ReportNotifyParams = {
  reportId: string;
  createdAt: string;
  reporterId: string;
  reporterEmail: string | null;
  detail: string;
  contact: string | null;
  mealId: string | null;
};

/**
 * Notifications e-mail pour un signalement:
 * - alerte support/admin via REPORT_ALERT_EMAIL (csv)
 * - copie de confirmation à l'utilisateur (si e-mail présent)
 *
 * Ne doit jamais bloquer la route API métier.
 */
export async function notifyReportCreated(params: ReportNotifyParams): Promise<void> {
  if (!resendConfigured()) return;

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "";
  const reportPage = site ? `${site}/signaler` : "/signaler";

  const detailSafe = escapeHtml(params.detail);
  const contactSafe = params.contact ? escapeHtml(params.contact) : "non renseigné";
  const mealSafe = params.mealId ? escapeHtml(params.mealId) : "aucun repas lié";
  const reporterEmailSafe = params.reporterEmail ? escapeHtml(params.reporterEmail) : "inconnu";
  const reportIdSafe = escapeHtml(params.reportId);
  const createdAtSafe = escapeHtml(params.createdAt);
  const reporterIdSafe = escapeHtml(params.reporterId);

  const adminRecipients = parseRecipients(process.env.REPORT_ALERT_EMAIL);
  if (adminRecipients.length > 0) {
    const adminSubject = `Nouveau signalement #${params.reportId.slice(0, 8)} · Paye ta graille`;
    const adminHtml = `<p>Nouveau signalement reçu.</p>
<ul>
  <li><strong>Report ID</strong>: ${reportIdSafe}</li>
  <li><strong>Créé le</strong>: ${createdAtSafe}</li>
  <li><strong>Reporter ID</strong>: ${reporterIdSafe}</li>
  <li><strong>Reporter email</strong>: ${reporterEmailSafe}</li>
  <li><strong>Contact saisi</strong>: ${contactSafe}</li>
  <li><strong>Repas lié</strong>: ${mealSafe}</li>
</ul>
<p><strong>Détail</strong></p>
<p>${detailSafe.replace(/\n/g, "<br />")}</p>
<p><a href="${escapeHtml(reportPage)}">Ouvrir la page Signaler</a></p>`;

    for (const to of adminRecipients) {
      const result = await sendResendEmail({
        to,
        subject: adminSubject,
        html: adminHtml,
      });
      if (!result.ok && process.env.NODE_ENV !== "production") {
        console.warn("[report-notify][admin]", to, result.error);
      }
    }
  }

  if (params.reporterEmail?.trim()) {
    const userSubject = "Signalement reçu · Paye ta graille";
    const userHtml = `<p>Bonjour,</p>
<p>Nous avons bien reçu ton signalement. Merci pour ton retour.</p>
<p><strong>Référence</strong>: ${reportIdSafe}</p>
<p><strong>Résumé</strong>: ${detailSafe.replace(/\n/g, "<br />")}</p>
<p style="font-size:12px;color:#666;">Si nécessaire, l’équipe pourra te recontacter via l’adresse utilisée sur ton compte.</p>`;

    const result = await sendResendEmail({
      to: params.reporterEmail.trim(),
      subject: userSubject,
      html: userHtml,
    });
    if (!result.ok && process.env.NODE_ENV !== "production") {
      console.warn("[report-notify][user]", result.error);
    }
  }
}
