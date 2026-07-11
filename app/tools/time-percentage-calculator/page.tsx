import React from "react";
import { Metadata } from "next";
import { timePercentageCalculatorData } from "@/lib/tools/data/time-percentage-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import TimePercentageCalculatorInputs from "@/components/tools/inputs/TimePercentageCalculatorInputs";

export const metadata: Metadata = {
  title: timePercentageCalculatorData.seo.title,
  description: timePercentageCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${timePercentageCalculatorData.slug}`,
  },
  openGraph: {
    title: timePercentageCalculatorData.seo.title,
    description: timePercentageCalculatorData.seo.metaDescription,
    url: `/tools/${timePercentageCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={timePercentageCalculatorData}
      InputsComponent={TimePercentageCalculatorInputs}
    />
  );
}
