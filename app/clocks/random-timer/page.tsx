import type { Metadata } from "next";
import RandomTimer from "@/components/clocks/experiences/RandomTimer";

export const metadata: Metadata = {
  title: "Random Timer Game | The God of Time",
  description: "A secret random time is set. Stop it exactly at zero. Tests your internal sense of time.",
  openGraph: {
    title: "Random Timer Game | The God of Time",
    description: "A secret random time is set. Stop it exactly at zero. Tests your internal sense of time.",
    url: "https://thegodoftime.com/clocks/random-timer",
  },
};

export default function RandomTimerPage() {
  return <RandomTimer />;
}
