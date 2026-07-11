import React from "react";
import { Metadata } from "next";
import { multiCityClockData } from "@/lib/tools/data/multi-city-clock";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import MultiCityGridInputs from "@/components/tools/inputs/MultiCityGridInputs";

export const metadata: Metadata = {
  title: multiCityClockData.seo.title,
  description: multiCityClockData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${multiCityClockData.slug}`,
  },
  openGraph: {
    title: multiCityClockData.seo.title,
    description: multiCityClockData.seo.metaDescription,
    url: `/tools/${multiCityClockData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={multiCityClockData}
      InputsComponent={MultiCityGridInputs}
    />
  );
}
