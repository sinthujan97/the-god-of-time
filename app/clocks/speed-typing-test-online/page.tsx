import React from "react";
import type { Metadata } from "next";
import SpeedTypingTester from "@/components/clocks/experiences/SpeedTypingTester";

export const metadata: Metadata = {
  title: "Speed Typing Test Online | Free Typing WPM Speed Test | The God of Time",
  description:
    "Test your typing speed (WPM) and accuracy online with our free speed typing test. Features multiple difficulty presets, custom durations, and live keyboard stats.",
  openGraph: {
    title: "Speed Typing Test Online | The God of Time",
    description: "Measure your typing words per minute (WPM), accuracy, and key rhythm. Practice and improve your typing skills.",
    url: "https://thegodoftime.com/clocks/speed-typing-test-online",
  },
  alternates: {
    canonical: "https://thegodoftime.com/clocks/speed-typing-test-online",
  },
};

export default function SpeedTypingTestPage() {
  return <SpeedTypingTester />;
}
