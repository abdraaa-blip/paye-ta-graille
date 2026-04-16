/**
 * Respecte nudge_level et plage de silence (heures locales fuseau Europe/Paris par défaut).
 */
export function shouldNotifyByEmail(params: {
  nudgeLevel: string | null | undefined;
  quietStartHour: number;
  quietEndHour: number;
  now?: Date;
  /** IANA, ex. Europe/Paris */
  timeZone?: string;
}): boolean {
  if (params.nudgeLevel === "off") return false;

  const tz = params.timeZone ?? "Europe/Paris";
  const now = params.now ?? new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const hourPart = parts.find((p) => p.type === "hour");
  const hour = hourPart ? Number(hourPart.value) : 12;

  const q0 = params.quietStartHour;
  const q1 = params.quietEndHour;

  if (q0 === q1) return true;

  if (q0 > q1) {
    if (hour >= q0 || hour < q1) return false;
  } else if (hour >= q0 && hour < q1) {
    return false;
  }
  return true;
}
