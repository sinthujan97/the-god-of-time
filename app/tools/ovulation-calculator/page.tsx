import React from "react";
import { Metadata } from "next";
import { ovulationCalculatorData } from "@/lib/tools/data/ovulation-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import OvulationCalculatorInputs from "@/components/tools/inputs/OvulationCalculatorInputs";

export const metadata: Metadata = {
  title: ovulationCalculatorData.seo.title,
  description: ovulationCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${ovulationCalculatorData.slug}`,
  },
  openGraph: {
    title: ovulationCalculatorData.seo.title,
    description: ovulationCalculatorData.seo.metaDescription,
    url: `/tools/${ovulationCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={ovulationCalculatorData}
      InputsComponent={OvulationCalculatorInputs}
    />
  );
}
