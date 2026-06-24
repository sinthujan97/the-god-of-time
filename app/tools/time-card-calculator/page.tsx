import React from "react";
import { Metadata } from "next";
import { timeCardCalculatorData } from "@/lib/tools/data/time-card-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import TimeCardInputs from "@/components/tools/inputs/TimeCardInputs";

export const metadata: Metadata = {
  title: timeCardCalculatorData.seo.title,
  description: timeCardCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${timeCardCalculatorData.slug}`,
  },
  openGraph: {
    title: timeCardCalculatorData.seo.title,
    description: timeCardCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${timeCardCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={timeCardCalculatorData}
      InputsComponent={TimeCardInputs}
    />
  );
}
