"use client";

import Link from "next/link";
import { AuthPromptLink } from "@/components/AuthPromptLink";
import { useSupabaseSession } from "@/lib/auth/use-supabase-session";
import { UX_HOME } from "@/lib/ux-copy";

type Props = {
  guestLabel: string;
  guestBlurb: string;
  className: string;
  prefetch?: boolean;
};

/** Lien « Connexion » de l’index À propos : bascule vers l’accueil app si session déjà active. */
export function AboutAuthServiceLink({ guestLabel, guestBlurb, className, prefetch = false }: Props) {
  const { supabase, sessionActive, ready } = useSupabaseSession();
  const signedIn = Boolean(ready && supabase && sessionActive);

  if (signedIn) {
    return (
      <Link href="/accueil" className={className} prefetch={prefetch}>
        <span className="ptg-about-service-link__label">{UX_HOME.ctaSignedInApp}</span>
        <span className="ptg-about-service-link__blurb">{UX_HOME.aboutAuthSignedInBlurb}</span>
      </Link>
    );
  }

  return (
    <AuthPromptLink className={className} prefetch={prefetch} inlineStrong={false}>
      <span className="ptg-about-service-link__label">{guestLabel}</span>
      <span className="ptg-about-service-link__blurb">{guestBlurb}</span>
    </AuthPromptLink>
  );
}
