"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  clearAuthEmailDeviceStorage,
  persistAuthEmailHint,
  PTG_LOCAL_AUTH_EMAIL_KEY,
  PTG_LOCAL_AUTH_REMEMBER_EMAIL_KEY,
} from "@/lib/auth/device-email-hint";
import { getPostLoginPath } from "@/lib/auth/post-login-path";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { InviteRefBanner } from "@/components/InviteRefBanner";
import { MarketingPulseLine } from "@/components/MarketingPulseLine";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { MARKETING_ENTRY_PULSE_LINES } from "@/lib/marketing-copy";
import { emitInviteAttributionOnce } from "@/lib/growth-invite-attribution";
import { trackGrowthEvent } from "@/lib/growth-events";
import { UX_AUTH } from "@/lib/ux-copy";

function getEmailRedirectTo(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    try {
      return new URL("/auth/callback", explicit).toString();
    } catch {
      // Fallback sur l'origine courante si NEXT_PUBLIC_SITE_URL est mal formée.
    }
  }
  return `${window.location.origin}/auth/callback`;
}

function AuthForm() {
  const searchParams = useSearchParams();
  const err = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [authErrorDetail, setAuthErrorDetail] = useState<string | null>(null);
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [emailHintFromDevice, setEmailHintFromDevice] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(true);
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const otpDigits = otp.replace(/\D/g, "");

  useEffect(() => {
    void trackGrowthEvent({ event: "auth_page_viewed", context: "auth" });
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) setSessionActive(Boolean(session));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionActive(Boolean(session));
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    try {
      if (localStorage.getItem(PTG_LOCAL_AUTH_REMEMBER_EMAIL_KEY) === "0") setRememberEmail(false);
    } catch {
      /* idem rememberAuthEmail */
    }
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(PTG_LOCAL_AUTH_REMEMBER_EMAIL_KEY) === "0") return;
      const hint = localStorage.getItem(PTG_LOCAL_AUTH_EMAIL_KEY)?.trim();
      if (!hint) return;
      setEmailHintFromDevice(true);
      setEmail((prev) => prev || hint);
    } catch {
      /* idem rememberAuthEmail */
    }
  }, []);

  function forgetStoredAuthEmail() {
    clearAuthEmailDeviceStorage();
    setRememberEmail(false);
    setEmailHintFromDevice(false);
    setEmail("");
    setOtp("");
    setOtpError(false);
    if (status === "sent") setStatus("idle");
    if (status === "error") {
      setStatus("idle");
      setAuthErrorDetail(null);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setStatus("sending");
    setAuthErrorDetail(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: getEmailRedirectTo(),
      },
    });
    if (error) {
      const code = "code" in error && typeof (error as { code?: string }).code === "string" ? (error as { code: string }).code : null;
      setAuthErrorDetail([error.message, code ? `(${code})` : null].filter(Boolean).join(" "));
      setStatus("error");
      return;
    }
    persistAuthEmailHint(email, rememberEmail);
    setStatus("sent");
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    const token = otpDigits;
    if (token.length < 6 || token.length > 10) return;
    setOtpSubmitting(true);
    setOtpError(false);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token,
      type: "email",
    });
    setOtpSubmitting(false);
    if (error) {
      setOtpError(true);
      return;
    }
    persistAuthEmailHint(email, rememberEmail);
    void trackGrowthEvent({ event: "auth_otp_verified", context: "auth" });
    await emitInviteAttributionOnce("auth_otp");
    await goToAppAfterLogin();
  }

  async function goToAppAfterLogin() {
    if (!supabase) {
      window.location.assign("/accueil");
      return;
    }
    const path = await getPostLoginPath(supabase);
    window.location.assign(path);
  }

  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
          <div className="ptg-form-panel">
            <Link href="/" className="ptg-link-back">
              ← {UX_AUTH.backToPresentation}
            </Link>
            <PtgMenuCard variant="ember" stamp="Bienvenue">
              <div className="ptg-page-head">
                <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
                  {UX_AUTH.title}
                </h1>
                <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
                <MarketingPulseLine lines={MARKETING_ENTRY_PULSE_LINES} intervalMs={6800} className="ptg-accueil-pulse" />
                <p className="ptg-type-body" style={{ margin: "0 0 0" }}>
                  {UX_AUTH.intro}
                </p>
              </div>
            </PtgMenuCard>

            <InviteRefBanner />

            {err === "auth" && (
              <p className="ptg-banner ptg-banner-warn" role="alert">
                {UX_AUTH.errExpired}
              </p>
            )}
            {err === "config" && (
              <p className="ptg-banner ptg-banner-warn" role="alert">
                {UX_AUTH.errConfig}
              </p>
            )}

            {supabase && sessionActive && (
              <p className="ptg-banner" role="status" style={{ marginBottom: "1rem" }}>
                {UX_AUTH.alreadyInSession}{" "}
                <Link href="/accueil">{UX_AUTH.goToAppAccueil}</Link>
                {" · "}
                <Link href="/decouvrir">{UX_AUTH.goToDiscover}</Link>
              </p>
            )}

            {!supabase && (
              <div className="ptg-banner ptg-banner-warn" style={{ marginBottom: "1rem" }}>
                <strong>{UX_AUTH.demoTitle}</strong>. {UX_AUTH.demoBody}
                <div style={{ marginTop: "0.75rem" }}>
                  <Link href="/onboarding" className="ptg-btn-primary" style={{ display: "inline-flex" }}>
                    {UX_AUTH.demoCta}
                  </Link>
                </div>
              </div>
            )}

            {supabase && (
              <>
                <form onSubmit={submit}>
              <div className="ptg-field">
                <label className="ptg-label" htmlFor="email">
                  {UX_AUTH.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="ptg-input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailHintFromDevice(false);
                    if (status === "error") {
                      setStatus("idle");
                      setAuthErrorDetail(null);
                    }
                    setOtp("");
                    setOtpError(false);
                  }}
                />
                {emailHintFromDevice && (
                  <p className="ptg-type-body" style={{ margin: "0.45rem 0 0", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
                    {UX_AUTH.emailRememberHint}
                  </p>
                )}
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "var(--ptg-text-sm)",
                    color: "var(--ptg-text-muted)",
                    marginTop: "0.65rem",
                    lineHeight: 1.4,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberEmail}
                    onChange={(e) => {
                      const on = e.target.checked;
                      setRememberEmail(on);
                      try {
                        localStorage.setItem(PTG_LOCAL_AUTH_REMEMBER_EMAIL_KEY, on ? "1" : "0");
                        if (!on) localStorage.removeItem(PTG_LOCAL_AUTH_EMAIL_KEY);
                      } catch {
                        /* idem rememberAuthEmail */
                      }
                      if (!on) {
                        setEmailHintFromDevice(false);
                      }
                    }}
                    style={{
                      marginTop: "0.15rem",
                      width: "1rem",
                      height: "1rem",
                      accentColor: "var(--ptg-accent)",
                      flexShrink: 0,
                    }}
                  />
                  <span>{UX_AUTH.emailRememberChoice}</span>
                </label>
                <p style={{ margin: "0.5rem 0 0" }}>
                  <button
                    type="button"
                    onClick={forgetStoredAuthEmail}
                    className="ptg-type-body"
                    style={{
                      padding: 0,
                      border: "none",
                      background: "none",
                      font: "inherit",
                      fontSize: "var(--ptg-text-sm)",
                      color: "var(--ptg-accent-deep)",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                      cursor: "pointer",
                    }}
                  >
                    {UX_AUTH.emailForgetOnDevice}
                  </button>
                </p>
              </div>
              <button
                type="submit"
                className="ptg-btn-primary"
                style={{ width: "100%" }}
                disabled={status === "sending"}
              >
                {status === "sending" ? UX_AUTH.submitBusy : UX_AUTH.submit}
              </button>
            </form>
            {status === "sent" && (
              <>
                <p className="ptg-type-body" style={{ marginTop: "1rem" }} role="status">
                  {UX_AUTH.sent}
                </p>
                <form onSubmit={submitOtp} style={{ marginTop: "1.25rem" }}>
                  <div className="ptg-field">
                    <label className="ptg-label" htmlFor="otp">
                      {UX_AUTH.otpLabel}
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      className="ptg-input"
                      placeholder="12345678"
                      maxLength={10}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 10));
                        setOtpError(false);
                      }}
                    />
                    <p className="ptg-type-body" style={{ margin: "0.5rem 0 0", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
                      {UX_AUTH.otpHint}
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="ptg-btn-primary"
                    style={{ width: "100%", marginTop: "0.75rem" }}
                    disabled={otpSubmitting || otpDigits.length < 6 || otpDigits.length > 10}
                  >
                    {otpSubmitting ? UX_AUTH.otpBusy : UX_AUTH.otpSubmit}
                  </button>
                  {otpError && (
                    <p className="ptg-banner ptg-banner-warn" style={{ marginTop: "0.75rem" }} role="alert">
                      {UX_AUTH.otpErr}
                    </p>
                  )}
                </form>
              </>
            )}
            {status === "error" && (
              <div className="ptg-banner ptg-banner-warn" style={{ marginTop: "1rem" }} role="alert">
                <p style={{ margin: "0 0 0.5rem", fontWeight: 600 }}>
                  {UX_AUTH.errSendTitle}
                </p>
                <pre
                  style={{
                    margin: "0 0 0.75rem",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "var(--ptg-text-sm)",
                    fontFamily: "inherit",
                  }}
                >
                  {authErrorDetail ?? "…"}
                </pre>
                {authErrorDetail?.includes("over_email_send_rate_limit") ? (
                  <p style={{ margin: 0, fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text)" }}>
                    {UX_AUTH.errRate}
                  </p>
                ) : (
                  <p style={{ margin: 0, fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text)" }}>
                    {UX_AUTH.errCheck}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <p className="ptg-type-body" style={{ marginTop: "1.5rem", fontSize: "var(--ptg-text-sm)" }}>
          En continuant, tu acceptes nos <Link href="/legal/cgu">conditions</Link> et notre{" "}
          <Link href="/legal/confidentialite">politique de confidentialité</Link>.
        </p>

        {supabase && (
          <p style={{ marginTop: "1rem" }}>
            <Link href="/onboarding" className="ptg-link-back" style={{ marginBottom: 0 }}>
              {UX_AUTH.skipLink}
            </Link>
          </p>
        )}
          </div>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="ptg-page-inner">{UX_AUTH.suspense}</div>}>
      <AuthForm />
    </Suspense>
  );
}
