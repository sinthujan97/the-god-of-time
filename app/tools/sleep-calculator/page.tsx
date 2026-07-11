import React from "react";
import { Metadata } from "next";
import { sleepCalculatorData } from "@/lib/tools/data/sleep-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import SleepCalculatorInputs from "@/components/tools/inputs/SleepCalculatorInputs";

export const metadata: Metadata = {
  title: sleepCalculatorData.seo.title,
  description: sleepCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${sleepCalculatorData.slug}`,
  },
  openGraph: {
    title: sleepCalculatorData.seo.title,
    description: sleepCalculatorData.seo.metaDescription,
    url: `/tools/${sleepCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={sleepCalculatorData}
      InputsComponent={SleepCalculatorInputs}
    />
  );
}
