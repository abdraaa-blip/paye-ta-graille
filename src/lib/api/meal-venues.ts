import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * PostgREST peut refuser l’embed `venues (...)` si la relation meals ↔ venues n’est pas dans le cache.
 * Requête séparée, même forme agrégée qu’un embed (tableau par repas).
 */
export async function venuesByMealId(
  supabase: SupabaseClient,
  mealIds: string[],
): Promise<Map<string, Record<string, unknown>[]>> {
  const map = new Map<string, Record<string, unknown>[]>();
  if (mealIds.length === 0) return map;

  const { data, error } = await supabase
    .from("venues")
    .select("id, meal_id, name, address, place_id, lat, lng, chosen_by, created_at")
    .in("meal_id", mealIds);

  if (error || !data) {
    return map;
  }

  for (const row of data) {
    const mid = row.meal_id as string;
    const list = map.get(mid) ?? [];
    list.push(row as unknown as Record<string, unknown>);
    map.set(mid, list);
  }
  return map;
}
