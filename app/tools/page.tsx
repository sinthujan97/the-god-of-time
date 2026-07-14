import React from "react";
import type { Metadata } from "next";
import ToolsHero from "@/components/tools/ToolsHero";
import ToolsGrid from "@/components/tools/ToolsGrid";

export const metadata: Metadata = {
  title: "All Time Tools | The God of Time",
  description:
    "100+ precision time tools. Date calculators, timezone converters, payroll planners, health timers, and more — all free and instant.",
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "All Time Tools | The God of Time",
    description:
      "100+ precision time tools. Date calculators, timezone converters, payroll planners, health timers, and more — all free and instant.",
    url: "/tools",
  },
};

export default function ToolsIndexPage() {
  return (
    <>
      <ToolsHero />
      <ToolsGrid />
    </>
  );
}
