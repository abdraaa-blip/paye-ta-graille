import { isTerminalMealStatus, type MealStatus } from "@/types/meal";

/** Rôle sur le repas pour autoriser une transition. */
export type MealParticipantRole = "host" | "guest";

export function mealParticipantRole(
  userId: string,
  hostUserId: string,
  guestUserId: string | null,
): MealParticipantRole | null {
  if (userId === hostUserId) return "host";
  if (guestUserId != null && userId === guestUserId) return "guest";
  return null;
}

/**
 * Transitions autorisées (PATCH status) : aligné UX `MealDetailClient` + `MATRICE_REPAS_ETATS_PERMISSIONS.md`.
 * `venue_proposed` via soumission lieu = route `venue`, pas ce tableau.
 */
const ALLOWED: Partial<Record<MealStatus, Partial<Record<MealStatus, readonly MealParticipantRole[]>>>> = {
  proposed: {
    matched: ["guest"],
    cancelled: ["host", "guest"],
  },
  matched: {
    cancelled: ["host", "guest"],
  },
  venue_proposed: {
    venue_confirmed: ["guest"],
    cancelled: ["host", "guest"],
  },
  venue_confirmed: {
    confirmed: ["host", "guest"],
    cancelled: ["host", "guest"],
  },
  confirmed: {
    /** Manuel : hôte ou invité. Sinon clôture auto côté cron après fin de créneau + grâce (`meal-reminders`). */
    completed: ["host", "guest"],
    cancelled: ["host", "guest"],
  },
};

export function assertMealStatusTransition(
  fromStatus: string,
  toStatus: string,
  role: MealParticipantRole | null,
): { ok: true } | { ok: false; message: string } {
  if (fromStatus === toStatus) {
    return { ok: false, message: "Statut inchangé." };
  }

  if (isTerminalMealStatus(fromStatus as MealStatus)) {
    return { ok: false, message: "Ce repas est déjà terminé ou annulé." };
  }

  const allowedRoles = ALLOWED[fromStatus as MealStatus]?.[toStatus as MealStatus];
  if (!allowedRoles) {
    return {
      ok: false,
      message: `Transition « ${fromStatus} » → « ${toStatus} » non autorisée.`,
    };
  }

  if (!role || !allowedRoles.includes(role)) {
    return {
      ok: false,
      message: "Cette action n’est pas permise pour ton rôle sur ce repas.",
    };
  }

  return { ok: true };
}
