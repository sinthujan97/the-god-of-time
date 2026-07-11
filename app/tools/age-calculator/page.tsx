import React from "react";
import { Metadata } from "next";
import { ageCalculatorData } from "@/lib/tools/data/age-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import AgeCalculatorInputs from "@/components/tools/inputs/AgeCalculatorInputs";

export const metadata: Metadata = {
  title: ageCalculatorData.seo.title,
  description: ageCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${ageCalculatorData.slug}`,
  },
  openGraph: {
    title: ageCalculatorData.seo.title,
    description: ageCalculatorData.seo.metaDescription,
    url: `/tools/${ageCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={ageCalculatorData}
      InputsComponent={AgeCalculatorInputs}
    />
  );
}
