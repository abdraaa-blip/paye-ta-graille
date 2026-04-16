"use client";

import { useEffect } from "react";
import Link from "next/link";
import { UX_ERRORS } from "@/lib/ux-copy";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <main className="ptg-page" aria-label="Erreur globale">
          <div
            className="ptg-form-panel"
            style={{ maxWidth: "28rem", margin: "3rem auto", padding: "2rem 1.5rem", textAlign: "center" }}
          >
            <h1 className="ptg-type-display" style={{ fontSize: "var(--ptg-text-xl)", margin: "0 0 0.75rem" }}>
              {UX_ERRORS.errorTitle}
            </h1>
            <p className="ptg-type-body" style={{ margin: "0 0 1.5rem" }}>
              {UX_ERRORS.errorBody}
            </p>
            <div className="ptg-stack ptg-stack--roomy">
              <button type="button" className="ptg-btn-primary" onClick={() => reset()}>
                {UX_ERRORS.errorRetry}
              </button>
              <Link href="/" className="ptg-btn-secondary">
                {UX_ERRORS.errorHome}
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
