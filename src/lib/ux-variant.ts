/**
 * Variante de copy UX (A/B). Définir NEXT_PUBLIC_PTG_UX_VARIANT=b pour la variante B.
 * Doc : paires exportées dans ux-copy.ts et marketing-copy.ts (suffixe _PAIR).
 */

export type UxVariant = "a" | "b";

export function getUxVariant(): UxVariant {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_PTG_UX_VARIANT === "b") {
    return "b";
  }
  return "a";
}

export function uxa<T extends Record<UxVariant, string>>(pair: T): string {
  return pair[getUxVariant()];
}
