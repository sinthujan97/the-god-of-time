import type { Metadata } from "next";
import SpeedReadingMetronome from "@/components/clocks/experiences/SpeedReadingMetronome";

export const metadata: Metadata = {
  title: "Speed-Reading Metronome | WPM Tachistoscope | The God of Time",
  description: "A performance speed reading metronome trained to pacing text words from 400 WPM to 1000 WPM to eliminate subvocalization. Customize speed presets.",
  openGraph: {
    title: "Speed-Reading Metronome | WPM Tachistoscope | The God of Time",
    description: "Train your brain to read at high speed using visual word metronome pacing dials.",
    url: "https://thegodoftime.com/clocks/speed-reading-metronome",
  },
};

export default function SpeedReadingMetronomePage() {
  return <SpeedReadingMetronome />;
}
