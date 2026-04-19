import Link from "next/link";
import { BrandScribbleBackdrop } from "@/components/BrandScribbleBackdrop";
import { HeroAtmosphere } from "@/components/HeroAtmosphere";
import { HeroOrbitLabels } from "@/components/HeroOrbitLabels";
import { HomeCinematicMarqueBand } from "@/components/HomeCinematicMarqueBand";
import { HomeMarketAtmosphereBand } from "@/components/HomeMarketAtmosphereBand";
import { HeroIllustrationBackdrop } from "@/components/HeroIllustrationBackdrop";
import { MarketingPulseLine } from "@/components/MarketingPulseLine";
import { PtgLandingDecor } from "@/components/PtgLandingDecor";
import { SiteFooter } from "@/components/SiteFooter";
import { heroIllustrationEnabled, heroIllustrationPortraitRailSrc } from "@/lib/env-public";
import {
  MARKETING_CORE_PROMISE,
  MARKETING_HOME_PULSE_LINES,
  MARKETING_HERO_PRIMARY,
  MARKETING_SECONDARY_LINE,
  MARKETING_TAGLINE_GOLDEN,
} from "@/lib/marketing-copy";
import { UX_HOME } from "@/lib/ux-copy";

export default function HomePage() {
  const heroRasterOn = heroIllustrationEnabled();

  return (
    <div className="ptg-page" data-ptg-hero-raster={heroRasterOn ? "on" : "off"}>
      <section className="ptg-hero-shell ptg-hero-shell--illus-hero" aria-labelledby="hero-title">
        <div className="ptg-hero-shell__media">
          <HeroIllustrationBackdrop portraitRailSrc={heroIllustrationPortraitRailSrc()} />
          <HeroAtmosphere />
          <BrandScribbleBackdrop emphasis />
          <PtgLandingDecor variant="subtle" />
        </div>
        <div className="ptg-hero-stage">
          <HeroOrbitLabels />
          <div className="ptg-hero-card">
            <Link
              href="/a-propos"
              className="ptg-kicker-pill ptg-kicker-pill--hero ptg-kicker-pill--link"
              aria-label={UX_HOME.kickerLinkAria}
            >
              {UX_HOME.kicker}
            </Link>
            <div className="ptg-accent-rule ptg-accent-rule--hero" />
            <MarketingPulseLine lines={MARKETING_HOME_PULSE_LINES} intervalMs={6500} className="ptg-home-pulse" />
            <h1 id="hero-title" className="ptg-type-display ptg-type-display--hero" style={{ margin: "0 0 0.65rem" }}>
              {MARKETING_HERO_PRIMARY}
            </h1>
            <p className="ptg-tagline-lead">{MARKETING_TAGLINE_GOLDEN}</p>
            <p className="ptg-type-body" style={{ margin: "0 0 0.5rem" }}>
              {MARKETING_CORE_PROMISE}
            </p>
            <p className="ptg-type-body" style={{ margin: "0 0 0.75rem" }}>
              {MARKETING_SECONDARY_LINE} {UX_HOME.blurbAfterSecondary}
            </p>
            <p className="ptg-type-body" style={{ margin: "0 0 0.75rem" }}>
              {UX_HOME.blurbProduct}
            </p>
            <p
              className="ptg-type-body"
              style={{ margin: "0 0 0.65rem", fontSize: "var(--ptg-text-md-sm)", color: "var(--ptg-text-muted)" }}
            >
              {UX_HOME.closing}
            </p>
            <p
              className="ptg-type-body"
              style={{
                margin: "0 0 1.5rem",
                fontSize: "var(--ptg-text-ui-sm)",
                fontStyle: "italic",
                color: "var(--ptg-text-muted)",
                lineHeight: 1.5,
              }}
            >
              {UX_HOME.whisper}
            </p>
            <div className="ptg-stack ptg-stack--roomy ptg-guide-press-cycle ptg-motion-profile-subtle">
              <Link href="/commencer" className="ptg-btn-primary ptg-guide-press" style={{ textAlign: "center" }}>
                {UX_HOME.ctaPrimary}
              </Link>
              <Link href="/auth" className="ptg-btn-secondary ptg-guide-press">
                {UX_HOME.ctaHasAccount}
              </Link>
            </div>
            <div className="ptg-hero-proof" aria-hidden>
              <span>repas réels</span>
              <span>quartier proche</span>
              <span>vibe chaleureuse</span>
            </div>
          </div>
        </div>
      </section>
      <HomeCinematicMarqueBand />
      <HomeMarketAtmosphereBand />
      <SiteFooter />
    </div>
  );
}
