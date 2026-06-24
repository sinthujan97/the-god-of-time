import React from "react";
import { Metadata } from "next";
import { sprintDateCalculatorData } from "@/lib/tools/data/sprint-date-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import SprintDateCalculatorInputs from "@/components/tools/inputs/SprintDateCalculatorInputs";

export const metadata: Metadata = {
  title: sprintDateCalculatorData.seo.title,
  description: sprintDateCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${sprintDateCalculatorData.slug}`,
  },
  openGraph: {
    title: sprintDateCalculatorData.seo.title,
    description: sprintDateCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${sprintDateCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={sprintDateCalculatorData}
      InputsComponent={SprintDateCalculatorInputs}
    />
  );
}
