import type { Metadata } from "next";
import { PartenairesClient } from "@/app/partenaires/PartenairesClient";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Partenaires",
  description: "Partenariats restaurants, événements et sponsors locaux pour Paye ta graille.",
};

export default function PartenairesPage() {
  return (
    <div className="ptg-page">
      <div className="ptg-page-inner">
        <PartenairesClient />
      </div>
      <SiteFooter />
    </div>
  );
}
