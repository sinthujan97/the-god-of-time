import type { Metadata } from "next";
import WorldClock from "@/components/clocks/experiences/WorldClock";

export const metadata: Metadata = {
  title: "World Clock | Multi-City Time Tracker | The God of Time",
  description: "Create your personal dashboard of global clocks. Pinned locations with analog and digital options, daylight indicators, and office hours relative to your local time.",
  openGraph: {
    title: "World Clock | Multi-City Time Tracker | The God of Time",
    description: "Create your personal dashboard of global clocks. Pinned locations with analog and digital options.",
    url: "https://thegodoftime.com/clocks/world-clock",
  },
};

export default function WorldClockPage() {
  return <WorldClock />;
}
