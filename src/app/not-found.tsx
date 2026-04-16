import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { UX_ERRORS } from "@/lib/ux-copy";

export const metadata: Metadata = {
  title: UX_ERRORS.notFoundTitle,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="ptg-page">
      <div
        className="ptg-form-panel"
        style={{ maxWidth: "28rem", margin: "3rem auto", padding: "2rem 1.5rem", textAlign: "center" }}
      >
        <h1 className="ptg-type-display" style={{ fontSize: "var(--ptg-text-xl)", margin: "0 0 0.75rem" }}>
          {UX_ERRORS.notFoundTitle}
        </h1>
        <p className="ptg-type-body" style={{ margin: "0 0 1.5rem" }}>
          {UX_ERRORS.notFoundBody}
        </p>
        <Link href="/" className="ptg-btn-primary" style={{ display: "inline-block", textAlign: "center" }}>
          {UX_ERRORS.notFoundCtaHome}
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}
