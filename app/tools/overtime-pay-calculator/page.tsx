import React from "react";
import { Metadata } from "next";
import { overtimePayCalculatorData } from "@/lib/tools/data/overtime-pay-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import OvertimePayInputs from "@/components/tools/inputs/OvertimePayInputs";

export const metadata: Metadata = {
  title: overtimePayCalculatorData.seo.title,
  description: overtimePayCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${overtimePayCalculatorData.slug}`,
  },
  openGraph: {
    title: overtimePayCalculatorData.seo.title,
    description: overtimePayCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${overtimePayCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={overtimePayCalculatorData}
      InputsComponent={OvertimePayInputs}
    />
  );
}
