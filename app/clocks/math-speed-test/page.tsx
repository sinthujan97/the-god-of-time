import React from "react";
import type { Metadata } from "next";
import MathSpeedTester from "@/components/clocks/experiences/MathSpeedTester";

export const metadata: Metadata = {
  title: "Math Speed Test | Free Mental Arithmetic Trainer | The God of Time",
  description:
    "Test your mental arithmetic speed with our online math test. Features custom difficulty levels, equations (addition, subtraction, multiplication, division), and live timing benchmarks.",
  openGraph: {
    title: "Math Speed Test | The God of Time",
    description: "Solve as many math equations as you can in 30, 60, or 120 seconds. Challenge your mental speed and accuracy.",
    url: "https://thegodoftime.com/clocks/math-speed-test",
  },
  alternates: {
    canonical: "https://thegodoftime.com/clocks/math-speed-test",
  },
};

export default function MathSpeedTestPage() {
  return <MathSpeedTester />;
}
