import Link from "next/link";
import Image from "next/image";
import { extensionsNavVisible } from "@/lib/feature-modules";

export function AppNav({
  current,
}: {
  current?: "accueil" | "decouvrir" | "moi" | "reseau" | "graille-plus";
}) {
  const showPlus = extensionsNavVisible();

  return (
    <nav className="ptg-nav" aria-label="Navigation principale">
      <Link href="/" className="ptg-nav-brand" aria-label="Retour à la présentation Paye ta Graille">
        <Image
          src="/hero/brand-logo-signature.png"
          alt="Logo Paye ta Graille"
          width={112}
          height={75}
          className="ptg-nav-brand__img"
        />
      </Link>
      <Link
        href="/accueil"
        className={current === "accueil" ? "ptg-nav-link ptg-nav-link--active" : "ptg-nav-link"}
        aria-current={current === "accueil" ? "page" : undefined}
      >
        Accueil
      </Link>
      <Link
        href="/decouvrir"
        className={current === "decouvrir" ? "ptg-nav-link ptg-nav-link--active" : "ptg-nav-link"}
        aria-current={current === "decouvrir" ? "page" : undefined}
      >
        Rencontres
      </Link>
      {showPlus && (
        <Link
          href="/graille-plus"
          className={current === "graille-plus" ? "ptg-nav-link ptg-nav-link--active" : "ptg-nav-link"}
          aria-current={current === "graille-plus" ? "page" : undefined}
        >
          Graille+
        </Link>
      )}
      <Link
        href="/reseau-graille"
        className={current === "reseau" ? "ptg-nav-link ptg-nav-link--active" : "ptg-nav-link"}
        aria-current={current === "reseau" ? "page" : undefined}
      >
        Compagnons
      </Link>
      <Link
        href="/moi"
        className={current === "moi" ? "ptg-nav-link ptg-nav-link--active" : "ptg-nav-link"}
        aria-current={current === "moi" ? "page" : undefined}
      >
        Moi
      </Link>
    </nav>
  );
}
