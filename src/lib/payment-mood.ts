/** Intention d’addition côté payeur : métadonnées Stripe / ledger (pas de split automatique). */
export const PAYMENT_MOODS = ["invite", "split", "guest"] as const;
export type PaymentMood = (typeof PAYMENT_MOODS)[number];

export function paymentMoodFromSearchParam(v: string | null | undefined): PaymentMood | null {
  if (!v) return null;
  return (PAYMENT_MOODS as readonly string[]).includes(v) ? (v as PaymentMood) : null;
}

export function paymentMoodCheckoutDescription(m: PaymentMood): string {
  switch (m) {
    case "invite":
      return "Intention : j’invite (montant total ou convenu).";
    case "split":
      return "Intention : 50/50, ta part.";
    case "guest":
      return "Intention : invité·e, geste convenu.";
  }
}
