import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPostLoginPath } from "@/lib/auth/post-login-path";
import { isSupabaseConfigured } from "@/lib/env-public";
import { safeAuthRedirectPath } from "@/lib/http/safe-redirect-path";

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const next = safeAuthRedirectPath(url.searchParams.get("next"), "/accueil");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/auth?error=config`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=auth`);
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
    return NextResponse.redirect(`${origin}/auth?error=auth`);
  }

  let destination = next;
  if (destination === "/accueil") {
    destination = await getPostLoginPath(supabase);
  }

  const response = NextResponse.redirect(`${origin}${destination}`);
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}
