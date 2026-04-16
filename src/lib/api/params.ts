import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import type { NextResponse } from "next/server";

const uuid = z.string().uuid();

/**
 * Valide un segment d’URL attendu comme UUID (repas, etc.) avant hit DB.
 */
export function requireUuidParam(
  value: string,
  label = "identifiant",
): { ok: true; id: string } | { ok: false; response: NextResponse } {
  const parsed = uuid.safeParse(value);
  if (!parsed.success) {
    return {
      ok: false,
      response: jsonError("validation_error", `${label} invalide.`, 400),
    };
  }
  return { ok: true, id: parsed.data };
}
