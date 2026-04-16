import type { Metadata } from "next";
import { AProposClient } from "@/components/AProposClient";
import { SiteFooter } from "@/components/SiteFooter";
import { ABOUT_BRAND_NAME } from "@/lib/about-copy";

export const metadata: Metadata = {
  title: "À propos",
  description: `${ABOUT_BRAND_NAME}. Repas réels, intentions claires, chaleur sans promesse creuse.`,
};

export default function AProposPage() {
  return (
    <div className="ptg-page">
      <AProposClient />
      <SiteFooter />
    </div>
  );
}
