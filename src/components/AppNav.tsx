"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BRAND_LOGO_SIGNATURE_HEIGHT,
  BRAND_LOGO_SIGNATURE_WEBP_SRC,
  BRAND_LOGO_SIGNATURE_WIDTH,
} from "@/lib/brand-logo";
import { useCallback, useEffect, useState } from "react";
import { extensionsNavVisible } from "@/lib/feature-modules";

export function AppNav({
  current,
}: {
  current?: "accueil" | "decouvrir" | "moi" | "reseau" | "graille-plus";
}) {
  const showPlus = extensionsNavVisible();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json()) as { unread_count?: number };
      setUnreadCount(Math.max(0, Number(json.unread_count ?? 0)));
    } catch {
      // Réseau/session indisponible: on conserve l'état courant sans casser la nav.
    }
  }, []);

  useEffect(() => {
    void refreshNotifications();
    const id = window.setInterval(() => void refreshNotifications(), 45_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refreshNotifications();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refreshNotifications]);

  return (
    <nav className="ptg-nav" aria-label="Navigation principale">
      <Link href="/" className="ptg-nav-brand" aria-label="Retour à la présentation Paye ta Graille">
        <Image
          src={BRAND_LOGO_SIGNATURE_WEBP_SRC}
          alt="Logo Paye ta Graille"
          width={BRAND_LOGO_SIGNATURE_WIDTH}
          height={BRAND_LOGO_SIGNATURE_HEIGHT}
          sizes="(max-width: 720px) 34vw, 5.5rem"
          quality={100}
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
        {unreadCount > 0 ? (
          <span className="ptg-nav-notif-badge" aria-label={`${unreadCount} notifications non lues`}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </Link>
    </nav>
  );
}
