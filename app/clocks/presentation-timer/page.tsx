import type { Metadata } from "next";
import PresentationTimer from "@/components/clocks/experiences/PresentationTimer";

export const metadata: Metadata = {
  title: "Presentation Timer | The God of Time",
  description: "Fullscreen speaker timer. Color changes as time runs low. Slide-by-slide mode divides time across your slides.",
  openGraph: {
    title: "Presentation Timer | The God of Time",
    description: "Fullscreen speaker timer. Color changes as time runs low. Slide-by-slide mode divides time across your slides.",
    url: "https://thegodoftime.com/clocks/presentation-timer",
  },
};

export default function PresentationTimerPage() {
  return <PresentationTimer />;
}
