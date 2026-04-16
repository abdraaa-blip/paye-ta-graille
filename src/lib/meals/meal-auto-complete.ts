/**
 * Instant de référence pour savoir si le créneau repas est passé : fin de fenêtre si renseignée, sinon début.
 * Si `window_end` est incohérent (< start), on garde `window_start` seul.
 */
export function mealClosingReferenceMs(windowStart: string, windowEnd: string | null): number {
  const t0 = new Date(windowStart).getTime();
  if (!Number.isFinite(t0)) return NaN;
  if (windowEnd == null || windowEnd === "") return t0;
  const t1 = new Date(windowEnd).getTime();
  if (!Number.isFinite(t1)) return t0;
  return Math.max(t0, t1);
}

/** Cron : auto-complete activé sauf PTG_MEAL_AUTO_COMPLETE=0|false|off */
export function isMealAutoCompleteEnabled(): boolean {
  const v = process.env.PTG_MEAL_AUTO_COMPLETE?.trim().toLowerCase();
  return v !== "0" && v !== "false" && v !== "off";
}

/** Heures après la fin de créneau (défaut 24). */
export function mealAutoCompleteGraceHours(): number {
  const raw = process.env.PTG_MEAL_AUTO_COMPLETE_GRACE_HOURS?.trim();
  const n = raw ? Number(raw) : 24;
  return Number.isFinite(n) && n >= 0 ? n : 24;
}

/** True si la RPC `auto_complete_confirmed_meals` n’est pas en base (dev / migration pas encore poussée). */
export function isMissingAutoCompleteRpc(err: {
  message?: string;
  code?: string;
} | null): boolean {
  if (!err) return false;
  const msg = (err.message ?? "").toLowerCase();
  const code = String(err.code ?? "");
  if (code === "42883" || code === "PGRST202") return true;
  if (msg.includes("could not find the function")) return true;
  if (msg.includes("auto_complete_confirmed_meals") && msg.includes("does not exist")) return true;
  return false;
}
