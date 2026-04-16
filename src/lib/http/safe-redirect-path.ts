/**
 * Empêche les redirections ouvertes après OAuth (param `next`).
 * Autorise uniquement un chemin relatif interne, sans schéma ni protocol-relative URL.
 */
export function safeAuthRedirectPath(raw: string | null | undefined, fallback: string): string {
  if (raw == null || raw === "") return fallback;

  const trimmed = raw.trim();
  if (trimmed.length > 512) return fallback;
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) return fallback;
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  // Évite javascript:, data:, etc. si un client passait une valeur non normalisée
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return fallback;

  return trimmed;
}
