import React from "react";
import { Metadata } from "next";
import { fiscalQuarterCalculatorData } from "@/lib/tools/data/fiscal-quarter-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import FiscalQuarterCalculatorInputs from "@/components/tools/inputs/FiscalQuarterCalculatorInputs";

export const metadata: Metadata = {
  title: fiscalQuarterCalculatorData.seo.title,
  description: fiscalQuarterCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${fiscalQuarterCalculatorData.slug}`,
  },
  openGraph: {
    title: fiscalQuarterCalculatorData.seo.title,
    description: fiscalQuarterCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${fiscalQuarterCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={fiscalQuarterCalculatorData}
      InputsComponent={FiscalQuarterCalculatorInputs}
    />
  );
}
