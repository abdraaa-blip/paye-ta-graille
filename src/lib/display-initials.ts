/** Initiales affichées sur avatar placeholder (prénom / pseudo). */

export function displayInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) {
    const w = parts[0];
    if (w.length >= 2) return w.slice(0, 2).toLocaleUpperCase("fr");
    return (w[0] ?? "·").toLocaleUpperCase("fr");
  }
  const a = parts[0][0] ?? "";
  const b = parts[1][0] ?? "";
  return (a + b).toLocaleUpperCase("fr");
}
