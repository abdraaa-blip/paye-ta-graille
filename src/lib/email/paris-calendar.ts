/** Date calendaire YYYY-MM-DD dans un fuseau IANA (ex. Europe/Paris), pour plafonds « par jour ». */
export function calendarDateInTimeZone(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
