import type { Metadata } from "next";
import TimeBlindnessTester from "@/components/clocks/experiences/TimeBlindnessTester";

export const metadata: Metadata = {
  title: "Time Blindness Tester | The God of Time",
  description: "How accurate is your sense of time? Try to stop at exactly 30 seconds, 1 minute, 5 minutes.",
  openGraph: {
    title: "Time Blindness Tester | The God of Time",
    description: "How accurate is your sense of time? Try to stop at exactly 30 seconds, 1 minute, or 5 minutes.",
    url: "https://thegodoftime.com/clocks/time-blindness",
  },
};

export default function TimeBlindnessPage() {
  return <TimeBlindnessTester />;
}
