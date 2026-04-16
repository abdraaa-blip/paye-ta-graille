import type { Metadata } from "next";
import { MoiClient } from "./MoiClient";

export const metadata: Metadata = {
  title: "Moi",
  description: "Profil, repas, aide et déconnexion.",
};

export default function MoiPage() {
  return <MoiClient />;
}
