import React from "react";
import { Metadata } from "next";
import { ganttChartDateCalculatorData } from "@/lib/tools/data/gantt-chart-date-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import GanttChartDateCalculatorInputs from "@/components/tools/inputs/GanttChartDateCalculatorInputs";

export const metadata: Metadata = {
  title: ganttChartDateCalculatorData.seo.title,
  description: ganttChartDateCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${ganttChartDateCalculatorData.slug}`,
  },
  openGraph: {
    title: ganttChartDateCalculatorData.seo.title,
    description: ganttChartDateCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${ganttChartDateCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={ganttChartDateCalculatorData}
      InputsComponent={GanttChartDateCalculatorInputs}
    />
  );
}
