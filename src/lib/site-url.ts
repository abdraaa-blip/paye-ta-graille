/**
 * URL canonique pour `metadataBase` (Open Graph, etc.).
 * Ordre : NEXT_PUBLIC_SITE_URL → https://VERCEL_URL → localhost.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    try {
      return new URL(explicit);
    } catch {
      /* ignore */
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const withProto = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    try {
      return new URL(withProto);
    } catch {
      /* ignore */
    }
  }
  return new URL("http://localhost:3000");
}
