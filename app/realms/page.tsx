import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import RealmsHero from "@/components/realms/RealmsHero";
import RealmsGrid from "@/components/realms/RealmsGrid";

export const metadata: Metadata = {
  title: "Realms | The God of Time",
  description:
    "Immersive cosmic time experiences. Black holes, wormholes, alternate histories, and the fabric of spacetime — all interactive.",
  openGraph: {
    title: "Realms | The God of Time",
    description:
      "Immersive cosmic time experiences. Black holes, wormholes, alternate histories, and the fabric of spacetime — all interactive.",
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
