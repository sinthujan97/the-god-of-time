import React from "react";
import PaintDrySimulator from "@/components/realms/experiences/PaintDrySimulator";

export const metadata = {
  title:
    "Paint Dry Simulator | Watch Paint Dry in Real Time | The God of Time",
  description:
    "Watch paint dry in real time with scientific accuracy. A 4-hour live drying experience with philosophical commentary. The most pointless and strangely satisfying thing on the internet.",
  keywords: [
    "watch paint dry",
    "paint dry simulator",
    "paint drying timer",
    "real time paint drying",
    "absurd clock",
  ],
  openGraph: {
    title: "Paint Dry Simulator | The God of Time",
    description:
      "Watch paint dry in real time. Absurdist messages. Scientific accuracy. Complete pointlessness.",
    url: "https://thegodoftime.com/realms/paint-dry-simulator",
  },
  alternates: {
    canonical: "https://thegodoftime.com/realms/paint-dry-simulator",
  },
};

export default function PaintDrySimulatorPage() {
  return (
    <PaintDrySimulator />
  );
}
