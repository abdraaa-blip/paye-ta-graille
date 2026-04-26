import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { PTG_AUTH_PATH } from "@/lib/auth/auth-path";
import { getPostLoginPath } from "@/lib/auth/post-login-path";
import { isSupabaseConfigured } from "@/lib/env-public";
import { safeAuthRedirectPath } from "@/lib/http/safe-redirect-path";
import { applyInviteAttributionCookiesFromCallbackUrl } from "@/lib/invite-attribution-callback";
import { createServiceRoleClient } from "@/lib/supabase/admin";

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const next = safeAuthRedirectPath(url.searchParams.get("next"), "/accueil");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}${PTG_AUTH_PATH}?error=config`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}${PTG_AUTH_PATH}?error=auth`);
  }

  const pendingCookies: CookieToSet[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          pendingCookies.push(...cookiesToSet);
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}${PTG_AUTH_PATH}?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const uid = user?.id;
  if (uid) {
    const admin = createServiceRoleClient();
    const client = admin ?? supabase;
    const { error: geErr } = await client.from("growth_events").insert({
      user_id: uid,
      event_name: "auth_magic_link_exchange",
      context: "auth_callback",
      metadata: {},
    });
    if (geErr && process.env.NODE_ENV !== "production") {
      console.warn("[auth/callback] growth_events:", geErr.message);
    }
  }

  let destination = next;
  if (destination === "/accueil") {
    destination = await getPostLoginPath(supabase);
  }

  const response = NextResponse.redirect(`${origin}${destination}`);
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  applyInviteAttributionCookiesFromCallbackUrl(response, url, url.protocol === "https:");
  return response;
}
