import { ABOUT_LIVRET_HASH_ALIASES, ABOUT_LIVRET_POSTER_HASH_ALIASES, ABOUT_LIVRET_SESSION_KEY } from "@/lib/about-copy";

export const ABOUT_LIVRET_SECTION_ID = "livret-payetagraille";
export const ABOUT_SERVICES_SECTION_ID = "apropos-services";

/** Même seuil que `@media (max-width: 720px)` dans `globals.css` (index replié sur mobile uniquement). */
export const ABOUT_SERVICES_INDEX_NARROW_MQ = "(max-width: 720px)";

export type LivretPersisted = { open: boolean; page: number };

export function readLivretSession(): LivretPersisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ABOUT_LIVRET_SESSION_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== "object") return null;
    const open = "open" in p && typeof (p as LivretPersisted).open === "boolean" ? (p as LivretPersisted).open : false;
    const page = "page" in p && typeof (p as LivretPersisted).page === "number" ? (p as LivretPersisted).page : 0;
    return { open, page };
  } catch {
    return null;
  }
}

export function writeLivretSession(state: LivretPersisted): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ABOUT_LIVRET_SESSION_KEY, JSON.stringify(state));
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

export function posterHashMatches(hash: string): boolean {
  return (ABOUT_LIVRET_POSTER_HASH_ALIASES as readonly string[]).includes(normalizeHash(hash));
}

export function stripOurLivretHash(): void {
  if (typeof window === "undefined") return;
  const h = window.location.hash.slice(1);
  if (
    h === ABOUT_LIVRET_SECTION_ID ||
    (ABOUT_LIVRET_HASH_ALIASES as readonly string[]).includes(h) ||
    (ABOUT_LIVRET_POSTER_HASH_ALIASES as readonly string[]).includes(h)
  ) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
}

export function setLivretHashIfAllowed(): void {
  if (typeof window === "undefined") return;
  const cur = window.location.hash.slice(1);
  if (
    !cur ||
    cur === ABOUT_LIVRET_SECTION_ID ||
    (ABOUT_LIVRET_HASH_ALIASES as readonly string[]).includes(cur) ||
    (ABOUT_LIVRET_POSTER_HASH_ALIASES as readonly string[]).includes(cur)
  ) {
    window.history.replaceState(null, "", `#${ABOUT_LIVRET_SECTION_ID}`);
  }
}

export function scrollToAboutServices(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(ABOUT_SERVICES_SECTION_ID)?.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}
