import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ToolsHero from "@/components/tools/ToolsHero";
import ToolsGrid from "@/components/tools/ToolsGrid";

export const metadata: Metadata = {
  title: "All Time Tools | The God of Time",
  description:
    "100+ precision time tools. Date calculators, timezone converters, payroll planners, health timers, and more — all free and instant.",
  openGraph: {
    title: "All Time Tools | The God of Time",
    description:
      "100+ precision time tools. Date calculators, timezone converters, payroll planners, health timers, and more — all free and instant.",
    url: "https://thegodoftime.com/tools",
  },
};

export default function ToolsIndexPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <ToolsHero />
        <ToolsGrid />
      </main>
      <Footer />
    </>
  );
}
