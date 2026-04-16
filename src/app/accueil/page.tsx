import type { Metadata } from "next";
import { AccueilClient } from "./AccueilClient";

export const metadata: Metadata = {
  title: "Accueil",
  description: "Repas tranquille, table ouverte ou expérience : par où tu commences ?",
};

export default function AccueilPage() {
  return <AccueilClient />;
}
