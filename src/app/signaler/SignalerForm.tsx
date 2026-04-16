"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { readApiError } from "@/lib/api/read-api-error";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { UX_LOADING, UX_SIGNALER } from "@/lib/ux-copy";

function SignalerFormInner() {
  const searchParams = useSearchParams();
  const mealId = searchParams.get("meal");
  const [detail, setDetail] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detail,
          contact: contact.trim() || null,
          meal_id: mealId && /^[0-9a-f-]{36}$/i.test(mealId) ? mealId : null,
        }),
      });
      if (res.status === 401) {
        setStatus("err");
        setMessage(UX_SIGNALER.errAuth);
        return;
      }
      if (!res.ok) {
        setStatus("err");
        setMessage((await readApiError(res)).message);
        return;
      }
      await res.json();
      setStatus("ok");
      setMessage(UX_SIGNALER.ok);
      setDetail("");
      setContact("");
    } catch {
      setStatus("err");
      setMessage(UX_SIGNALER.errNet);
    }
  }

  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
          <Link href="/accueil" className="ptg-link-back">
            ← Accueil
          </Link>
        <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
          {UX_SIGNALER.title}
        </h1>
        <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
        <p className="ptg-type-body" style={{ margin: "0 0 1.25rem" }}>
          {UX_SIGNALER.intro}
        </p>

        {mealId && (
          <p className="ptg-banner" style={{ marginBottom: "1rem" }}>
            {UX_SIGNALER.mealLinked} : <code style={{ fontSize: "0.85em" }}>{mealId.slice(0, 8)}…</code>
          </p>
        )}

        {status === "ok" && (
          <p className="ptg-banner" role="status">
            {message}
          </p>
        )}
        {status === "err" && (
          <p className="ptg-banner ptg-banner-warn" role="alert">
            {message}{" "}
            {message.toLowerCase().includes("connect") && (
              <Link href="/auth"> Connexion</Link>
            )}
          </p>
        )}

        <form onSubmit={submit}>
          <div className="ptg-field">
            <label className="ptg-label" htmlFor="detail">
              Détail (min. 10 caractères)
            </label>
            <textarea
              id="detail"
              required
              minLength={10}
              className="ptg-input"
              rows={6}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>
          <div className="ptg-field">
            <label className="ptg-label" htmlFor="contact">
              {UX_SIGNALER.contactLabel}
            </label>
            <input
              id="contact"
              type="email"
              className="ptg-input"
              autoComplete="email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <button type="submit" className="ptg-btn-primary" style={{ width: "100%" }} disabled={status === "sending"}>
            {status === "sending" ? UX_SIGNALER.submitBusy : UX_SIGNALER.submit}
          </button>
        </form>
        </div>
      </PtgAppFlow>
    </div>
  );
}

export function SignalerForm() {
  return (
    <Suspense fallback={<div className="ptg-page-inner">{UX_LOADING}</div>}>
      <SignalerFormInner />
    </Suspense>
  );
}
