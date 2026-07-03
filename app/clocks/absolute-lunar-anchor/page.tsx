import type { Metadata } from "next";
import AbsoluteLunarAnchor from "@/components/clocks/experiences/AbsoluteLunarAnchor";

export const metadata: Metadata = {
  title: "Absolute Lunar Anchor | Tidal Loop Sync Clock | The God of Time",
  description: "A specialized marine and tide sync clock tracking the mechanical 12-hour 25-minute lunar tidal cycle. Ideal for coastal workers, surfers, and marine operations.",
  openGraph: {
    title: "Absolute Lunar Anchor | Tidal Loop Sync Clock | The God of Time",
    description: "Track live high/low tide predictions, lunar distance offsets, and exact moon phases.",
    url: "https://thegodoftime.com/clocks/absolute-lunar-anchor",
  },
};

export default function AbsoluteLunarAnchorPage() {
  return <AbsoluteLunarAnchor />;
}
