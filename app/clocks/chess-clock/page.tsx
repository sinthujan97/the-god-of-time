import type { Metadata } from "next";
import ChessClock from "@/components/clocks/experiences/ChessClock";

export const metadata: Metadata = {
  title: "Chess Clock | The God of Time",
  description: "Two-player chess clock with configurable time controls. Blitz, rapid, and classical presets.",
  openGraph: {
    title: "Chess Clock | The God of Time",
    description: "Two-player chess clock with configurable time controls. Blitz, rapid, and classical presets.",
    url: "https://thegodoftime.com/clocks/chess-clock",
  },
};

export default function ChessClockPage() {
  return <ChessClock />;
}
