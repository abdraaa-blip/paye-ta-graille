import type { Metadata } from "next";
import { AProposClient } from "@/components/AProposClient";
import { SiteFooter } from "@/components/SiteFooter";
import { ABOUT_BRAND_NAME } from "@/lib/about-copy";

export const metadata: Metadata = {
  title: "À propos",
  description: `${ABOUT_BRAND_NAME} : concept, intentions, sociabilité autour du repas, partage et vision. Livret interactif « carte de restaurant ».`,
};

export default function AProposPage() {
  return (
    <div className="ptg-page">
      <AProposClient />
      <SiteFooter />
    </div>
  );
}
