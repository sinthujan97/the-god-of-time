import React from "react";
import type { Metadata } from "next";
import RealmsHero from "@/components/realms/RealmsHero";
import RealmsGrid from "@/components/realms/RealmsGrid";

export const metadata: Metadata = {
  title: "Realms | The God of Time",
  description:
    "Explore the Paint Dry Simulator — a scientifically accurate 4-hour paint drying timer with philosophical meditations on time.",
  alternates: {
    canonical: "/realms",
  },
  openGraph: {
    title: "Realms | The God of Time",
    description:
      "Explore the Paint Dry Simulator — a scientifically accurate 4-hour paint drying timer with philosophical meditations on time.",
    url: "/realms",
  },
};

export default function RealmsIndexPage() {
  return (
    <>
      <RealmsHero />
      <RealmsGrid />
    </>
  );
}
