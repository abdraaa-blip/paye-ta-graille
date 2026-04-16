/**
 * Envoi via API Resend (https://resend.com) : pas de paquet npm, fetch natif.
 */
const RESEND_API = "https://api.resend.com/emails";

export function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function sendResendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { ok: false, error: "RESEND_API_KEY manquant" };

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "Paye ta graille <onboarding@resend.dev>";

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text ?? stripHtml(options.html),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: body || `HTTP ${res.status}` };
  }
  return { ok: true };
}
