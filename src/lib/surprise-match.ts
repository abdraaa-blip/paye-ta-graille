/**
 * Règles « surprise graille » : intentions addition qui se répondent.
 * invite ↔ etre_invite · partage ↔ partage
 */

export function mealIntentsSurpriseCompatible(mine: string, theirs: string): boolean {
  if (mine === "invite" && theirs === "etre_invite") return true;
  if (mine === "etre_invite" && theirs === "invite") return true;
  if (mine === "partage" && theirs === "partage") return true;
  return false;
}

export type SurprisePick<T> = { profile: T; compatibleStrict: boolean };

export function pickSurpriseProfile<T extends { meal_intent: string }>(
  candidates: T[],
  myMealIntent: string | null | undefined,
): SurprisePick<T> | null {
  if (!candidates.length) return null;
  const mine = (myMealIntent ?? "").trim();
  const strict = mine
    ? candidates.filter((p) => mealIntentsSurpriseCompatible(mine, p.meal_intent))
    : [];
  const pool = strict.length > 0 ? strict : candidates;
  const idx = Math.floor(Math.random() * pool.length);
  return { profile: pool[idx]!, compatibleStrict: strict.length > 0 };
}
