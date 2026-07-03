import type { Metadata } from "next";
import AmbientClock from "@/components/clocks/experiences/AmbientClock";

export const metadata: Metadata = {
  title: "Ambient Clock Collection | The God of Time",
  description: "Six unusual clock faces: binary, word clock, hex color clock, Fibonacci, decimal, and analog.",
  openGraph: {
    title: "Ambient Clock Collection | The God of Time",
    description: "Six unusual clock faces: binary, word clock, hex color clock, Fibonacci, decimal, and analog.",
    url: "https://thegodoftime.com/clocks/ambient-clock",
  },
};

export default function AmbientClockPage() {
  return <AmbientClock />;
}
