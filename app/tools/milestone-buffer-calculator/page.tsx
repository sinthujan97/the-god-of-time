import React from "react";
import { Metadata } from "next";
import { milestoneBufferCalculatorData } from "@/lib/tools/data/milestone-buffer-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import MilestoneBufferCalculatorInputs from "@/components/tools/inputs/MilestoneBufferCalculatorInputs";

export const metadata: Metadata = {
  title: milestoneBufferCalculatorData.seo.title,
  description: milestoneBufferCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${milestoneBufferCalculatorData.slug}`,
  },
  openGraph: {
    title: milestoneBufferCalculatorData.seo.title,
    description: milestoneBufferCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${milestoneBufferCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={milestoneBufferCalculatorData}
      InputsComponent={MilestoneBufferCalculatorInputs}
    />
  );
}
