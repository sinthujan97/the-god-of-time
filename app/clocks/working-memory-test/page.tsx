import React from "react";
import type { Metadata } from "next";
import WorkingMemoryTest from "@/components/clocks/experiences/WorkingMemoryTest";

export const metadata: Metadata = {
  title: "Working Memory Test | Short-Term Memory Capacity Test | The God of Time",
  description:
    "Test your short-term working memory capacity with our digital digit span test. Play forward or backward modes with custom sequence lengths and speeds.",
  openGraph: {
    title: "Working Memory Test | The God of Time",
    description: "Measure your cognitive capacity and memory span. Test how many numbers and letters you can hold in your mind.",
    url: "https://thegodoftime.com/clocks/working-memory-test",
  },
  alternates: {
    canonical: "https://thegodoftime.com/clocks/working-memory-test",
  },
};

export default function WorkingMemoryTestPage() {
  return <WorkingMemoryTest />;
}
