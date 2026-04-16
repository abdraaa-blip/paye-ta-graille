/** Libellés UX : ton chaleureux ; valeurs en base (invite, partage, etre_invite) inchangées. */

const E = {
  plate: "\u{1F37D}\uFE0F",
  scales: "\u2696\uFE0F",
  noodles: "\u{1F35C}",
} as const;

export const MEAL_INTENT_LABELS: Record<string, string> = {
  invite: `J’invite ${E.plate}`,
  partage: `On partage ${E.scales}`,
  etre_invite: `Je me fais inviter ${E.noodles}`,
};

/** Courtes phrases sous les boutons (onboarding / profil). */
export const MEAL_INTENT_DESCRIPTIONS: Record<"invite" | "partage" | "etre_invite", string> = {
  invite: "C’est moi qui régale.",
  partage: "On coupe la note en deux.",
  etre_invite: "Si tu invites, je suis partant.",
};

export const SOCIAL_INTENT_LABELS: Record<string, string> = {
  ami: "Ami",
  ouvert: "Ouvert",
  dating_leger: "Dating léger",
};

export function mealIntentLabel(key: string | null | undefined): string {
  if (!key) return "…";
  return MEAL_INTENT_LABELS[key] ?? key;
}

export function socialIntentLabel(key: string | null | undefined): string {
  if (!key) return "…";
  return SOCIAL_INTENT_LABELS[key] ?? key;
}
