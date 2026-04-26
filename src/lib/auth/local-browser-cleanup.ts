import { clearSurpriseRecentIds } from "@/lib/surprise-recent-ids";

/** Données locales non critiques : à vider au logout pour appareil partagé / compte suivant. */
export function clearOptionalLocalCachesOnSignOut(): void {
  clearSurpriseRecentIds();
}
