import React from "react";
import { Metadata } from "next";
import { dateMidpointCalculatorData } from "@/lib/tools/data/date-midpoint-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DateMidpointCalculatorInputs from "@/components/tools/inputs/DateMidpointCalculatorInputs";

export const metadata: Metadata = {
  title: dateMidpointCalculatorData.seo.title,
  description: dateMidpointCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${dateMidpointCalculatorData.slug}`,
  },
  openGraph: {
    title: dateMidpointCalculatorData.seo.title,
    description: dateMidpointCalculatorData.seo.metaDescription,
    url: `/tools/${dateMidpointCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={dateMidpointCalculatorData}
      InputsComponent={DateMidpointCalculatorInputs}
    />
  );
}
