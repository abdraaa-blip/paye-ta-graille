import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

/**
 * Dev : origines autorisées pour `/_next/*` (téléphone sur le LAN, cf. `allowedDevOrigins`).
 * - `NEXT_DEV_ALLOWED_ORIGINS` : hôtes explicites, séparés par des virgules (sans `http://`).
 * - Par défaut en dev, on ajoute les IPv4 locales non loopback ; désactiver : `NEXT_DEV_DISCOVER_LAN=0`.
 */
const allowedDevOriginsFromEnv =
  process.env.NEXT_DEV_ALLOWED_ORIGINS?.split(",")
    .map((h) => h.trim())
    .filter(Boolean) ?? [];

function devLanHostnames(): string[] {
  if (process.env.NODE_ENV === "production") return [];
  if (process.env.NEXT_DEV_DISCOVER_LAN === "0") return [];
  const seen = new Set<string>();
  for (const infos of Object.values(networkInterfaces())) {
    for (const info of infos ?? []) {
      if (!info || info.internal || info.family !== "IPv4") continue;
      seen.add(info.address);
    }
  }
  return [...seen];
}

const allowedDevOrigins = [...new Set([...allowedDevOriginsFromEnv, ...devLanHostnames()])];

function remotePatternFromHttpUrl(raw: string | undefined): { protocol: "http" | "https"; hostname: string; pathname: "/**" } | null {
  const t = raw?.trim();
  if (!t?.startsWith("http")) return null;
  try {
    const u = new URL(t);
    const protocol = u.protocol === "https:" ? "https" : "http";
    return { protocol, hostname: u.hostname, pathname: "/**" };
  } catch {
    return null;
  }
}

/** `NEXT_PUBLIC_PTG_HERO_ART` / `NEXT_PUBLIC_PTG_OG_IMAGE` en URL : hosts autorisés pour `<Image />` au build. */
function publicImageRemotePatterns(): NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> {
  const seen = new Set<string>();
  const out: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [];
  for (const raw of [process.env.NEXT_PUBLIC_PTG_HERO_ART, process.env.NEXT_PUBLIC_PTG_OG_IMAGE]) {
    const p = remotePatternFromHttpUrl(raw);
    if (!p) continue;
    const key = `${p.protocol}://${p.hostname}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

const heroRemotes = publicImageRemotePatterns();

const cspReportOnly = String(process.env.PTG_CSP_REPORT_ONLY ?? "1").trim();
const cspReportUri = String(process.env.PTG_CSP_REPORT_URI ?? "").trim();
const isCspReportOnly = cspReportOnly !== "0" && cspReportOnly.toLowerCase() !== "false";
const cspParts = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https://*.supabase.co https://api.stripe.com https://maps.googleapis.com https://maps.gstatic.com",
];
if (cspReportUri) {
  cspParts.push(`report-uri ${cspReportUri}`);
}
const contentSecurityPolicy = cspParts.join("; ");

/** Next 16 exigera les qualités utilisées par `<Image quality={…} />` (ex. hero 82). */
const imagesConfig: NonNullable<NextConfig["images"]> = {
  qualities: [75, 82],
  ...(heroRemotes.length > 0 ? { remotePatterns: heroRemotes } : {}),
};

/** En-têtes défense en profondeur (sans CSP strict : incompatible scripts Next sans tuning). */
const baseSecurityHeaders: { key: string; value: string }[] = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  {
    key: isCspReportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
];

const securityHeaders =
  process.env.VERCEL_ENV === "production"
    ? [
        ...baseSecurityHeaders,
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : baseSecurityHeaders;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(allowedDevOrigins.length > 0 ? { allowedDevOrigins } : {}),
  images: imagesConfig,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
