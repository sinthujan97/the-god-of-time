import type { Metadata } from "next";
import IntervalSounds from "@/components/clocks/experiences/IntervalSounds";

export const metadata: Metadata = {
  title: "Meditation & Interval Bells | The God of Time",
  description: "Gentle bells at custom intervals. Meditation timer, study intervals, mindfulness reminders.",
  openGraph: {
    title: "Meditation & Interval Bells | The God of Time",
    description: "Gentle bells at custom intervals for meditation, study, and mindfulness.",
    url: "https://thegodoftime.com/clocks/interval-sounds",
  },
};

export default function IntervalSoundsPage() {
  return <IntervalSounds />;
}
