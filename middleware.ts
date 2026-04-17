import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env-public";

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (isSupabaseConfigured()) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: CookieToSet[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );
    await supabase.auth.getUser();
  }

  /* En-têtes défense (X-Frame-Options, etc.) : uniquement dans `next.config.ts` pour une seule source de vérité. */
  return response;
}

export const config = {
  matcher: [
    /*
     * Pas de refresh session sur statiques / favicon / métadonnées (moins de charge Supabase & crawlers).
     */
    /* Pas de session Supabase sur les assets `public/` (images, polices…) : moins de charge et moins de risques si la requête statique échoue en edge. */
    "/((?!_next/static|_next/image|favicon.ico|icon\\.svg|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|api/cron/|.*\\.(?:png|jpe?g|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
