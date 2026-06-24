import React from "react";
import { Metadata } from "next";
import { leadTimeCalculatorData } from "@/lib/tools/data/lead-time-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import LeadTimeCalculatorInputs from "@/components/tools/inputs/LeadTimeCalculatorInputs";

export const metadata: Metadata = {
  title: leadTimeCalculatorData.seo.title,
  description: leadTimeCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${leadTimeCalculatorData.slug}`,
  },
  openGraph: {
    title: leadTimeCalculatorData.seo.title,
    description: leadTimeCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${leadTimeCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={leadTimeCalculatorData}
      InputsComponent={LeadTimeCalculatorInputs}
    />
  );
}
