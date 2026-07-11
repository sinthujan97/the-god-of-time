import React from "react";
import { Metadata } from "next";
import { businessDaysCalculatorData } from "@/lib/tools/data/business-days-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import BusinessDaysInputs from "@/components/tools/inputs/BusinessDaysInputs";

export const metadata: Metadata = {
  title: businessDaysCalculatorData.seo.title,
  description: businessDaysCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${businessDaysCalculatorData.slug}`,
  },
  openGraph: {
    title: businessDaysCalculatorData.seo.title,
    description: businessDaysCalculatorData.seo.metaDescription,
    url: `/tools/${businessDaysCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={businessDaysCalculatorData}
      InputsComponent={BusinessDaysInputs}
    />
  );
}
