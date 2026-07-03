import type { Metadata } from "next";
import Stopwatch from "@/components/clocks/experiences/Stopwatch";

export const metadata: Metadata = {
  title: "Stopwatch | The God of Time",
  description: "Precision stopwatch with lap tracking, split times, and keyboard shortcuts. Accurate to the millisecond.",
  openGraph: {
    title: "Stopwatch | The God of Time",
    description: "Precision stopwatch with lap tracking, split times, and keyboard shortcuts.",
    url: "https://thegodoftime.com/clocks/stopwatch",
  },
};

export default function StopwatchPage() {
  return <Stopwatch />;
}
