import React from "react";
import { Metadata } from "next";
import { worldTimeConverterData } from "@/lib/tools/data/world-time-converter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import WorldTimeZoneConverterInputs from "@/components/tools/inputs/WorldTimeZoneConverterInputs";

export const metadata: Metadata = {
  title: worldTimeConverterData.seo.title,
  description: worldTimeConverterData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${worldTimeConverterData.slug}`,
  },
  openGraph: {
    title: worldTimeConverterData.seo.title,
    description: worldTimeConverterData.seo.metaDescription,
    url: `/tools/${worldTimeConverterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={worldTimeConverterData}
      InputsComponent={WorldTimeZoneConverterInputs}
    />
  );
}
