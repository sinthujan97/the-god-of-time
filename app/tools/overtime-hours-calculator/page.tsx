import React from "react";
import { Metadata } from "next";
import { overtimeHoursCalculatorData } from "@/lib/tools/data/overtime-hours-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import OvertimeHoursCalculatorInputs from "@/components/tools/inputs/OvertimeHoursCalculatorInputs";

export const metadata: Metadata = {
  title: overtimeHoursCalculatorData.seo.title,
  description: overtimeHoursCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${overtimeHoursCalculatorData.slug}`,
  },
  openGraph: {
    title: overtimeHoursCalculatorData.seo.title,
    description: overtimeHoursCalculatorData.seo.metaDescription,
    url: `/tools/${overtimeHoursCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={overtimeHoursCalculatorData}
      InputsComponent={OvertimeHoursCalculatorInputs}
    />
  );
}
