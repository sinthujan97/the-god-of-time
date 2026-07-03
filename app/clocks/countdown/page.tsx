import type { Metadata } from "next";
import CountdownTimer from "@/components/clocks/experiences/CountdownTimer";

export const metadata: Metadata = {
  title: "Countdown Timer | The God of Time",
  description: "Multiple simultaneous countdown timers with custom labels. Tab title updates so you can see it while working.",
  openGraph: {
    title: "Countdown Timer | The God of Time",
    description: "Multiple simultaneous countdown timers with custom labels.",
    url: "https://thegodoftime.com/clocks/countdown",
  },
};

export default function CountdownPage() {
  return <CountdownTimer />;
}
