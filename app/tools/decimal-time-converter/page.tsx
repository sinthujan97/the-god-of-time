import React from "react";
import { Metadata } from "next";
import { decimalTimeConverterData } from "@/lib/tools/data/decimal-time-converter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DecimalTimeConverterInputs from "@/components/tools/inputs/DecimalTimeConverterInputs";

export const metadata: Metadata = {
  title: decimalTimeConverterData.seo.title,
  description: decimalTimeConverterData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${decimalTimeConverterData.slug}`,
  },
  openGraph: {
    title: decimalTimeConverterData.seo.title,
    description: decimalTimeConverterData.seo.metaDescription,
    url: `/tools/${decimalTimeConverterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={decimalTimeConverterData}
      InputsComponent={DecimalTimeConverterInputs}
    />
  );
}
