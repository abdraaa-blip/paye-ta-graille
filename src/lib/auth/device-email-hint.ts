/**
 * E-mail et préférence « mémoriser » en localStorage (navigateur uniquement) pour préremplir /auth.
 * Pas de synchronisation serveur ; voir politique de confidentialité.
 */
export const PTG_LOCAL_AUTH_EMAIL_KEY = "ptg_last_auth_email";
export const PTG_LOCAL_AUTH_REMEMBER_EMAIL_KEY = "ptg_auth_remember_email";

export function persistAuthEmailHint(mail: string, allow: boolean): void {
  if (!allow) return;
  const t = mail.trim();
  if (!t) return;
  try {
    localStorage.setItem(PTG_LOCAL_AUTH_EMAIL_KEY, t);
    localStorage.setItem(PTG_LOCAL_AUTH_REMEMBER_EMAIL_KEY, "1");
  } catch {
    /* stockage refusé (navigateur / mode privé) */
  }
}

/** Efface l’e-mail mémorisé et désactive la mémorisation jusqu’à nouveau choix sur /auth. */
export function clearAuthEmailDeviceStorage(): void {
  try {
    localStorage.removeItem(PTG_LOCAL_AUTH_EMAIL_KEY);
    localStorage.setItem(PTG_LOCAL_AUTH_REMEMBER_EMAIL_KEY, "0");
  } catch {
    /* idem persistAuthEmailHint */
  }
}
