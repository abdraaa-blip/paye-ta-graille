import type { NextConfig } from "next";

/** Ex. téléphone sur le Wi‑Fi : `NEXT_DEV_ALLOWED_ORIGINS=172.20.10.12` (sans http, cf. doc Next). */
const allowedDevOrigins =
  process.env.NEXT_DEV_ALLOWED_ORIGINS?.split(",")
    .map((h) => h.trim())
    .filter(Boolean) ?? [];

/** `NEXT_PUBLIC_PTG_HERO_ART` en URL : autorise le host au build (même valeur requise en prod). */
function heroArtRemotePatterns(): NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> {
  const raw = process.env.NEXT_PUBLIC_PTG_HERO_ART?.trim();
  if (!raw?.startsWith("http")) return [];
  try {
    const u = new URL(raw);
    const protocol = u.protocol === "https:" ? "https" : "http";
    return [{ protocol, hostname: u.hostname, pathname: "/**" }];
  } catch {
    return [];
  }
}

const heroRemotes = heroArtRemotePatterns();

/** En-têtes défense en profondeur (sans CSP strict : incompatible scripts Next sans tuning). */
const securityHeaders: { key: string; value: string }[] = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(allowedDevOrigins.length > 0 ? { allowedDevOrigins } : {}),
  ...(heroRemotes.length > 0 ? { images: { remotePatterns: heroRemotes } } : {}),
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
