/** Coordination « qui ramène quoi » : uniquement pour repas format `group`. */

export const POTLUCK_SLOTS = ["entree", "plat", "dessert", "boissons", "rien"] as const;
export type PotluckSlot = (typeof POTLUCK_SLOTS)[number];

export type PotluckMode = "free" | "balanced" | "auto";

export type PotluckState = {
  mode: PotluckMode;
  assignments: Record<string, PotluckSlot>;
};

export const POTLUCK_LABELS: Record<PotluckSlot, string> = {
  entree: "Entrée",
  plat: "Plat principal",
  dessert: "Dessert",
  boissons: "Boissons",
  rien: "Je ne ramène rien (je participe)",
};

const ROLE_ORDER: Exclude<PotluckSlot, "rien">[] = ["entree", "plat", "dessert", "boissons"];

/** Répartition simple : une case par personne sur les 4 rôles, le reste en « rien ». */
export function suggestBalancedAssignments(userIds: string[]): Record<string, PotluckSlot> {
  const sorted = [...userIds].sort();
  const out: Record<string, PotluckSlot> = {};
  sorted.forEach((id, i) => {
    if (i < ROLE_ORDER.length) {
      out[id] = ROLE_ORDER[i]!;
    } else {
      out[id] = "rien";
    }
  });
  return out;
}

export function normalizePotluck(raw: unknown): PotluckState {
  if (!raw || typeof raw !== "object") {
    return { mode: "free", assignments: {} };
  }
  const o = raw as Record<string, unknown>;
  const mode = o.mode === "balanced" || o.mode === "auto" || o.mode === "free" ? o.mode : "free";
  const assignments: Record<string, PotluckSlot> = {};
  if (o.assignments && typeof o.assignments === "object" && !Array.isArray(o.assignments)) {
    for (const [k, v] of Object.entries(o.assignments as Record<string, unknown>)) {
      if (POTLUCK_SLOTS.includes(v as PotluckSlot)) {
        assignments[k] = v as PotluckSlot;
      }
    }
  }
  return { mode, assignments };
}

export function isPotluckSlot(v: string): v is PotluckSlot {
  return (POTLUCK_SLOTS as readonly string[]).includes(v);
}
