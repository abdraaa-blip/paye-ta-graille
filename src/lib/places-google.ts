/** Clé serveur Google Places (legacy Places API JSON). */
export function googlePlacesApiKey(): string | null {
  const k = process.env.GOOGLE_PLACES_API_KEY?.trim();
  return k || null;
}
