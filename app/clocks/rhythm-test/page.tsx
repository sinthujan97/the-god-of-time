import React from "react";
import type { Metadata } from "next";
import RhythmTest from "@/components/clocks/experiences/RhythmTest";

export const metadata: Metadata = {
  title: "Rhythm Test | Test Your Sense of Timing | The God of Time",
  description:
    "Test your internal sense of rhythm and timing accuracy in milliseconds. Keep the beat after the audio metronome cues fade into silence.",
  openGraph: {
    title: "Rhythm Test | The God of Time",
    description: "Are you early or late? Measure your beat alignment deviancy in milliseconds. Compare your internal tempo score.",
    url: "https://thegodoftime.com/clocks/rhythm-test",
  },
  alternates: {
    canonical: "https://thegodoftime.com/clocks/rhythm-test",
  },
};

export default function RhythmTestPage() {
  return <RhythmTest />;
}
