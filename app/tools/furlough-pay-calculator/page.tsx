import React from "react";
import { Metadata } from "next";
import { furloughPayCalculatorData } from "@/lib/tools/data/furlough-pay-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import FurloughPayInputs from "@/components/tools/inputs/FurloughPayInputs";

export const metadata: Metadata = {
  title: furloughPayCalculatorData.seo.title,
  description: furloughPayCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${furloughPayCalculatorData.slug}`,
  },
  openGraph: {
    title: furloughPayCalculatorData.seo.title,
    description: furloughPayCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${furloughPayCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={furloughPayCalculatorData}
      InputsComponent={FurloughPayInputs}
    />
  );
}
