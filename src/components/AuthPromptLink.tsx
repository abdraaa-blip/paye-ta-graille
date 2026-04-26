import Link from "next/link";
import { PTG_AUTH_PATH } from "@/lib/auth/auth-path";
import { UX_HOME } from "@/lib/ux-copy";

export type AuthPromptLinkProps = {
  /** Défaut : libellé CTA hero (A/B). */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  prefetch?: boolean;
  /**
   * Gras façon « lien dans une phrase » (erreurs 401, hints).
   * Désactiver pour les cartes type À propos où le style vient du `className`.
   */
  inlineStrong?: boolean;
};

/**
 * Lien vers la page connexion + copie standard (`UX_HOME.ctaHasAccount`).
 * Centralise `href` et le libellé pour tous les invites « connecte-toi ».
 */
export function AuthPromptLink({
  children,
  className,
  style,
  prefetch,
  inlineStrong = true,
}: AuthPromptLinkProps) {
  const isButton = Boolean(className?.includes("ptg-btn"));
  const strong = inlineStrong && !isButton;
  return (
    <Link
      href={PTG_AUTH_PATH}
      prefetch={prefetch}
      className={className}
      style={strong ? { fontWeight: 600, ...style } : style}
    >
      {children ?? UX_HOME.ctaHasAccount}
    </Link>
  );
}
