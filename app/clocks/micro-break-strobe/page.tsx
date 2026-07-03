import type { Metadata } from "next";
import MicroBreakStrobe from "@/components/clocks/experiences/MicroBreakStrobe";

export const metadata: Metadata = {
  title: "Micro-Break Strobe | Eye Strain Prevention | The God of Time",
  description: "A strict eye-strain prevention and productivity timer based on the optometrist-recommended 20-20-20 rule. Features high-compliance break overlays.",
  openGraph: {
    title: "Micro-Break Strobe | The God of Time",
    description: "Prevent digital eye strain with custom 20-20-20 rule countdown timers and compliance prompts.",
    url: "https://thegodoftime.com/clocks/micro-break-strobe",
  },
};

export default function MicroBreakStrobePage() {
  return <MicroBreakStrobe />;
}
