import Link from "next/link";
import { UX_FOOTER } from "@/lib/ux-copy";

export function SiteFooter() {
  return (
    <footer className="ptg-footer">
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
        <Link href="/signaler">{UX_FOOTER.report}</Link>
      </nav>
      <p className="ptg-footer-note">{UX_FOOTER.note}</p>
    </footer>
  );
}
