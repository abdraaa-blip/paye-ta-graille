/**
 * Modules produit optionnels — activation par variables NEXT_PUBLIC_* (= visibles côté client).
 * Tout à 0 ou absent : la V1 reste inchangée (pas de lien nav supplémentaire).
 */

function truthy(v: string | undefined): boolean {
  return v === "1" || v?.toLowerCase() === "true";
}

/** Partage culinaire encadré (repas maison, participation / don, réservation). */
export function moduleShareEnabled(): boolean {
  return truthy(process.env.NEXT_PUBLIC_PTG_MODULE_SHARE);
}

/** Anti-gaspillage / surplus (« Seconde graille »). */
export function moduleFoodRescueEnabled(): boolean {
  return truthy(process.env.NEXT_PUBLIC_PTG_MODULE_FOOD_RESCUE);
}

/** Paiement sécurisé repas (Stripe Connect / escrow — implémentation progressive). */
export function modulePaymentsEnabled(): boolean {
  return truthy(process.env.NEXT_PUBLIC_PTG_MODULE_PAYMENTS);
}

/** Affiche l’entrée « Graille+ » dans la nav si au moins un module est actif. */
export function extensionsNavVisible(): boolean {
  return moduleShareEnabled() || moduleFoodRescueEnabled() || modulePaymentsEnabled();
}

/**
 * « Surprise graille » sur Rencontres — désactiver avec NEXT_PUBLIC_PTG_SURPRISE_GRAILLE=0 ou false.
 * Absent / vide = activé (boucle découverte légère).
 */
export function surpriseGrailleEnabled(): boolean {
  const v = process.env.NEXT_PUBLIC_PTG_SURPRISE_GRAILLE;
  if (v === undefined || v === "") return true;
  return truthy(v);
}

/** Pour analytics / garde-fous futurs : libellé stable par module. */
export const MODULE_TELEMETRY_KEYS = {
  share: "ptg_module_share",
  foodRescue: "ptg_module_food_rescue",
  payments: "ptg_module_payments",
  surprise: "ptg_surprise_graille",
} as const;
