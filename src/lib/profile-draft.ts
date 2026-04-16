/**
 * Brouillon profil côté navigateur : utile pour tests UX avant brancher
 * l'API / Supabase (voir docs/BLUEPRINT_PRODUIT_FINAL_MVP.md).
 */
export const PROFILE_DRAFT_KEY = "ptg_onboarding_v1";

export type SocialIntent = "ami" | "ouvert" | "dating_leger";
export type MealIntent = "invite" | "partage" | "etre_invite";
export type NudgeLevel = "calme" | "normal" | "off";
export type MealWithPreference = "tout_le_monde" | "profils_similaires" | "decouvrir_styles";

export type ProfileDraft = {
  displayName: string;
  city: string;
  radiusKm: number;
  socialIntent: SocialIntent;
  mealIntent: MealIntent;
  mealWithPreference: MealWithPreference;
  tags: string[];
  dietaryNote: string;
  nudgeLevel: NudgeLevel;
  completedAt: string;
};

export const defaultProfileDraft = (): Omit<ProfileDraft, "completedAt"> => ({
  displayName: "",
  city: "",
  radiusKm: 10,
  socialIntent: "ouvert",
  mealIntent: "partage",
  mealWithPreference: "tout_le_monde",
  tags: [],
  dietaryNote: "",
  nudgeLevel: "normal",
});

export function loadProfileDraft(): ProfileDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<ProfileDraft>;
    if (!data.displayName || !data.city) return null;
    const defaults = defaultProfileDraft();
    return {
      ...defaults,
      ...data,
      mealWithPreference: data.mealWithPreference ?? defaults.mealWithPreference,
      completedAt: data.completedAt ?? "",
    } as ProfileDraft;
  } catch {
    return null;
  }
}

export function saveProfileDraft(data: ProfileDraft): void {
  window.localStorage.setItem(PROFILE_DRAFT_KEY, JSON.stringify(data));
}

export function clearProfileDraft(): void {
  window.localStorage.removeItem(PROFILE_DRAFT_KEY);
}
