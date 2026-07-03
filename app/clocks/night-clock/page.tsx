import type { Metadata } from "next";
import NightClock from "@/components/clocks/experiences/NightClock";

export const metadata: Metadata = {
  title: "Night Clock | The God of Time",
  description: "Minimal dark bedside clock. Auto-dims after 30 seconds. Touch to brighten.",
  openGraph: {
    title: "Night Clock | The God of Time",
    description: "Minimal dark bedside clock. Auto-dims after 30 seconds. Touch to brighten.",
    url: "https://thegodoftime.com/clocks/night-clock",
  },
};

export default function NightClockPage() {
  return <NightClock />;
}
