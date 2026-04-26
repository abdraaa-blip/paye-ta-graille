/**
 * Chemins auth : une seule constante pour éviter les typos et les divergences middleware / liens.
 * `?reauth=1` sur la page connexion : le middleware laisse passer même si une session existe
 * (autre compte, support — l’utilisateur doit souvent se déconnecter pour saisir un autre mail).
 */
export const PTG_AUTH_PATH = "/auth";
export const PTG_AUTH_CALLBACK_PATH = "/auth/callback";
export const PTG_AUTH_REAUTH_QUERY = "reauth";
