import type { Metadata } from "next";
import GlobalShiftOverlap from "@/components/clocks/experiences/GlobalShiftOverlap";

export const metadata: Metadata = {
  title: "Global Shift Overlap Planner | The God of Time",
  description: "A high-end global shift scheduler and operations monitor for corporate DevOps, support, and monitoring teams working across Americas, APAC, and EMEA rolling shifts.",
  openGraph: {
    title: "Global Shift Overlap Planner | The God of Time",
    description: "Track international shifts and critical handover overlap zones in real time.",
    url: "/clocks/global-shift-overlap",
  },
};

export default function GlobalShiftOverlapPage() {
  return <GlobalShiftOverlap />;
}
