import { ABOUT_LIVRET_HASH_ALIASES, ABOUT_LIVRET_SESSION_KEY } from "@/lib/about-copy";

export const ABOUT_LIVRET_SECTION_ID = "livret-payetagraille";
export const ABOUT_SERVICES_SECTION_ID = "apropos-services";

/** Page courante du livret (persistée). Ancienne forme `{ open, page }` : seul `page` est conservé. */
export type LivretPersisted = { page: number };

export function readLivretSession(): LivretPersisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ABOUT_LIVRET_SESSION_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== "object") return null;
    let page = 0;
    if ("page" in p && typeof (p as LivretPersisted).page === "number") {
      page = (p as LivretPersisted).page;
    }
    return { page };
  } catch {
    return null;
  }
}

export function writeLivretSession(state: LivretPersisted): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ABOUT_LIVRET_SESSION_KEY, JSON.stringify({ page: state.page }));
  } catch {
    /* quota / mode privé */
  }
}

function normalizeHash(hash: string): string {
  return hash.startsWith("#") ? hash.slice(1) : hash;
}

export function livretHashWantsOpen(hash: string): boolean {
  const h = normalizeHash(hash);
  return h === ABOUT_LIVRET_SECTION_ID || (ABOUT_LIVRET_HASH_ALIASES as readonly string[]).includes(h);
}

export function servicesHashMatches(hash: string): boolean {
  return normalizeHash(hash) === ABOUT_SERVICES_SECTION_ID;
}

export function scrollToAboutServices(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(ABOUT_SERVICES_SECTION_ID)?.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}
