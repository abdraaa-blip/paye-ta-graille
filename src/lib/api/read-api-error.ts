import type { ApiErrorBody } from "@/lib/api/errors";

export type ParsedApiError = { code?: string; message: string };

/**
 * Lit le corps JSON d’erreur API (`{ error: { code, message } }`) après un `fetch`.
 * Tolère corps vide ou non-JSON (tests / proxies).
 */
export async function readApiError(res: Response): Promise<ParsedApiError> {
  try {
    const text = await res.text();
    if (!text.trim()) {
      return { message: fallbackMessage(res.status) };
    }
    const j = JSON.parse(text) as unknown;
    if (!j || typeof j !== "object" || !("error" in j)) {
      return { message: fallbackMessage(res.status) };
    }
    const err = (j as Partial<ApiErrorBody>).error;
    if (!err || typeof err !== "object") {
      return { message: fallbackMessage(res.status) };
    }
    const message = typeof err.message === "string" ? err.message : null;
    const code = typeof err.code === "string" ? err.code : undefined;
    if (message) {
      return { code, message };
    }
    return { code, message: fallbackMessage(res.status) };
  } catch {
    return { message: fallbackMessage(res.status) };
  }
}

function fallbackMessage(status: number): string {
  if (status === 429) {
    return "Trop de requêtes. Réessaie dans un instant.";
  }
  return `Erreur ${status}`;
}
