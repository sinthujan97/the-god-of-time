import React from "react";
import type { Metadata } from "next";
import CpsTester from "@/components/clocks/experiences/CpsTester";

export const metadata: Metadata = {
  title: "CPS Test & Mouse Double Click Tester | Clicks Per Second | The God of Time",
  description:
    "Test your clicks per second (CPS) speed online and test your mouse switches for double-clicking hardware failure. Free, interactive mouse benchmark tool.",
  openGraph: {
    title: "CPS Test & Mouse Double Click Tester | The God of Time",
    description: "Measure your click speed (CPS) in 5s, 10s, or 30s trials, and diagnose hardware double-click switch chatter instantly.",
    url: "https://thegodoftime.com/clocks/cps-test",
  },
  alternates: {
    canonical: "https://thegodoftime.com/clocks/cps-test",
  },
};

export default function CpsTestPage() {
  return <CpsTester />;
}
