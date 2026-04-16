import type { Metadata } from "next";
import { ProfilClient } from "./ProfilClient";

export const metadata: Metadata = {
  title: "Ta fiche",
  description: "Ton intention à table, tes tags, tes rappels. Tu modifies quand tu veux.",
};

type Props = { searchParams: Promise<{ setup?: string }> };

export default async function ProfilPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <ProfilClient showPostAuthSetup={sp.setup === "1"} />;
}
