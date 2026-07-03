import type { Metadata } from "next";
import IntervalTimer from "@/components/clocks/experiences/IntervalTimer";

export const metadata: Metadata = {
  title: "Interval Timer | The God of Time",
  description: "Work/rest interval timer for workouts. Tabata, HIIT, and custom presets with audio cues.",
  openGraph: {
    title: "Interval Timer | The God of Time",
    description: "Work/rest interval timer for workouts. Tabata, HIIT, and custom presets with audio cues.",
    url: "https://thegodoftime.com/clocks/interval-timer",
  },
};

export default function IntervalTimerPage() {
  return <IntervalTimer />;
}
