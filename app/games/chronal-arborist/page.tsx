import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ChronalArborist from "@/components/games/ChronalArborist";

export const metadata: Metadata = {
  title: "Chronal Arborist | Grow the Seed of Eons | The God of Time",
  description:
    "A 10-minute roguelite word game. Solve chronological puzzles to grow an ancient tree through 10 stages. Reach the Golden Maturity to harvest Chronal Apples before time collapses.",
  openGraph: {
    title: "Chronal Arborist | The God of Time",
    description: "Grow the Seed of Eons. Solve history. Harvest time.",
    url: "https://thegodoftime.com/games/chronal-arborist",
  },
  alternates: {
    canonical: "https://thegodoftime.com/games/chronal-arborist",
  },
};

export default function ChronalArboristPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 56 }}>
        <ChronalArborist />
      </main>
      <Footer />
    </>
  );
}
