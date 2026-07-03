import type { Metadata } from "next";
import CircadianClock from "@/components/clocks/experiences/CircadianClock";

export const metadata: Metadata = {
  title: "Circadian Rhythm Clock | The God of Time",
  description: "Where are you in your body's daily rhythm right now? Shows peak alertness, energy, and ideal sleep windows.",
  openGraph: {
    title: "Circadian Rhythm Clock | The God of Time",
    description: "Where are you in your body's daily rhythm? Peak alertness, energy, and ideal sleep windows.",
    url: "https://thegodoftime.com/clocks/circadian-clock",
  },
};

export default function CircadianClockPage() {
  return <CircadianClock />;
}
