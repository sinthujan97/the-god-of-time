import React from "react";
import { Metadata } from "next";
import { ptoAccrualCalculatorData } from "@/lib/tools/data/pto-accrual-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import PtoAccrualInputs from "@/components/tools/inputs/PtoAccrualInputs";

export const metadata: Metadata = {
  title: ptoAccrualCalculatorData.seo.title,
  description: ptoAccrualCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${ptoAccrualCalculatorData.slug}`,
  },
  openGraph: {
    title: ptoAccrualCalculatorData.seo.title,
    description: ptoAccrualCalculatorData.seo.metaDescription,
    url: `/tools/${ptoAccrualCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={ptoAccrualCalculatorData}
      InputsComponent={PtoAccrualInputs}
    />
  );
}
