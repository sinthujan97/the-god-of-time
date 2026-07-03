import React from "react";
import type { Metadata } from "next";
import TemporalAnchor from "@/components/games/TemporalAnchor";

export const metadata: Metadata = {
  title: "Temporal Anchor | Save the Timeline | The God of Time",
  description:
    "A daily word game with a time twist. Historical events are dissolving — fire your temporal anchor to eliminate letter noise and save the artifact before the timeline collapses.",
  openGraph: {
    title: "Temporal Anchor | The God of Time",
    description: "Letters are dissolving. Fire the anchor. Save history.",
    url: "https://thegodoftime.com/games/temporal-anchor",
  },
  alternates: {
    canonical: "https://thegodoftime.com/games/temporal-anchor",
  },
};

export default function TemporalAnchorPage() {
  return <TemporalAnchor />;
}
