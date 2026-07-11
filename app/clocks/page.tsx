import type { Metadata } from "next";
import ClocksHero from "@/components/clocks/ClocksHero";
import ClocksGrid from "@/components/clocks/ClocksGrid";

export const metadata: Metadata = {
  title: "Clocks & Timers | Free Online Clocks | The God of Time",
  description:
    "Free online clocks and timers: stopwatch, countdown timer, Pomodoro, chess clock, world clock, meditation bells, ambient clock collection, and more.",
  openGraph: {
    title: "Clocks & Timers | The God of Time",
    description:
      "17 free online clocks and timers. Stopwatch, countdown, Pomodoro, chess clock, world clock, meditation bells, ambient displays, and more.",
    url: "/clocks",
  },
};

export default function ClocksIndexPage() {
  return (
    <>
      <ClocksHero />
      <ClocksGrid />
    </>
  );
}
