/**
 * Logo signature (nav, footer, livret, vitrine). WebP généré par `npm run optimize:hero`.
 * PNG : `public/hero/brand-logo-signature.png` — master fond papier : `npm run knockout:brand-logo-matte` puis `optimize:hero` (WebP **q98** ; damier RGB seulement : `knockout:brand-logo-checkerboard`). Nav/footer : `quality={100}`.
 * Fond cible site (détourage manuel type Photos) : **`#fbf6ef`** (`--ptg-bg`), pas `#ffffff`, pour éviter un halo sur le papier crème.
 * Master HD : `npm run regen:brand-logo-signature` (avec `public/hero/IMG_4562.png`).
 */
export const BRAND_LOGO_SIGNATURE_WEBP_SRC = "/hero/brand-logo-signature.webp" as const;
export const BRAND_LOGO_SIGNATURE_PNG_SRC = "/hero/brand-logo-signature.png" as const;
export const BRAND_LOGO_SIGNATURE_WIDTH = 1024 as const;
export const BRAND_LOGO_SIGNATURE_HEIGHT = 683 as const;
