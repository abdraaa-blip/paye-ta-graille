import type { Metadata } from "next";
import { DiscoverClient } from "./DiscoverClient";

export const metadata: Metadata = {
  title: "Autour de toi",
  description: "Découvre des profils dans ta ville et propose une table simplement.",
};

export default function DecouvrirPage() {
  return <DiscoverClient />;
}
