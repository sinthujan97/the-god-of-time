import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ChronoLock from "@/components/games/ChronoLock";

export const metadata: Metadata = {
  title: "Chrono Lock | Freeze the Clock | The God of Time",
  description:
    "A daily precision timing game. Freeze a running clock at the exact target time — unit by unit. Miss the hour and you lose your entire collection.",
  openGraph: {
    title: "Chrono Lock | The God of Time",
    description: "One shot per day. Freeze the clock. Don't miss the hour.",
    url: "https://thegodoftime.com/games/chrono-lock",
  },
  alternates: {
    canonical: "https://thegodoftime.com/games/chrono-lock",
  },
};

export default function ChronoLockPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 56 }}>
        <ChronoLock />
      </main>
      <Footer />
    </>
  );
}
