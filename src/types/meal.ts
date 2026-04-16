/**
 * Meal lifecycle : aligné docs/PRODUCT_SPEC.md et MATRICE_REPAS_ETATS_PERMISSIONS.md
 */
export const MEAL_STATUSES = [
  "none",
  "proposed",
  "matched",
  "venue_proposed",
  "venue_confirmed",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type MealStatus = (typeof MEAL_STATUSES)[number];

export function isTerminalMealStatus(s: MealStatus): boolean {
  return s === "completed" || s === "cancelled";
}
