import React from "react";
import type { Metadata } from "next";
import GamesHero from "@/components/games/GamesHero";
import GamesGrid from "@/components/games/GamesGrid";

export const metadata: Metadata = {
  title: "Games | The God of Time",
  description:
    "Daily precision timing games. One shot per day — freeze a running clock at the exact target time to earn badges. Miss the hour and lose everything.",
  openGraph: {
    title: "Games | The God of Time",
    description: "Daily precision timing challenges. One shot. Don't miss the hour.",
    url: "https://thegodoftime.com/games",
  },
};

export default function GamesPage() {
  return (
    <>
      <GamesHero />
      <GamesGrid />
    </>
  );
}
