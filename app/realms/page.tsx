import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import RealmsHero from "@/components/realms/RealmsHero";
import RealmsGrid from "@/components/realms/RealmsGrid";

export const metadata: Metadata = {
  title: "Realms | The God of Time",
  description:
    "Explore the Paint Dry Simulator — a scientifically accurate 4-hour paint drying timer with philosophical meditations on time.",
  openGraph: {
    title: "Realms | The God of Time",
    description:
      "Explore the Paint Dry Simulator — a scientifically accurate 4-hour paint drying timer with philosophical meditations on time.",
    url: "https://thegodoftime.com/realms",
  },
};

export default function RealmsIndexPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 56 }}>
        <RealmsHero />
        <RealmsGrid />
      </main>
      <Footer />
    </>
  );
}
