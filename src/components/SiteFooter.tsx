import Link from "next/link";
import Image from "next/image";
import { UX_FOOTER } from "@/lib/ux-copy";

export function SiteFooter() {
  return (
    <footer className="ptg-footer">
      <Link href="/" className="ptg-footer-brand" aria-label="Paye ta Graille · retour présentation">
        <Image
          src="/hero/brand-logo-signature.png"
          alt="Logo Paye ta Graille"
          width={132}
          height={88}
          className="ptg-footer-brand__img"
        />
      </Link>
      <nav aria-label="Liens légaux et informations">
        <Link href="/">{UX_FOOTER.presentation}</Link>
        <span className="ptg-footer-sep" aria-hidden>
          ·
        </span>
        <Link href="/a-propos">{UX_FOOTER.about}</Link>
        <span className="ptg-footer-sep" aria-hidden>
          ·
        </span>
        <Link href="/legal/cgu">{UX_FOOTER.legal}</Link>
        <span className="ptg-footer-sep" aria-hidden>
          ·
        </span>
        <Link href="/legal/confidentialite">{UX_FOOTER.privacy}</Link>
        <span className="ptg-footer-sep" aria-hidden>
          ·
        </span>
        <Link href="/partenaires">{UX_FOOTER.partners}</Link>
        <span className="ptg-footer-sep" aria-hidden>
          ·
        </span>
        <Link href="/signaler">{UX_FOOTER.report}</Link>
      </nav>
      <p className="ptg-footer-note">{UX_FOOTER.note}</p>
    </footer>
  );
}
