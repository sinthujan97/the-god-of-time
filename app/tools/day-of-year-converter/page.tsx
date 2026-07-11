import React from "react";
import { Metadata } from "next";
import { dayOfYearConverterData } from "@/lib/tools/data/day-of-year-converter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DayOfYearConverterInputs from "@/components/tools/inputs/DayOfYearConverterInputs";

export const metadata: Metadata = {
  title: dayOfYearConverterData.seo.title,
  description: dayOfYearConverterData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${dayOfYearConverterData.slug}`,
  },
  openGraph: {
    title: dayOfYearConverterData.seo.title,
    description: dayOfYearConverterData.seo.metaDescription,
    url: `/tools/${dayOfYearConverterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={dayOfYearConverterData}
      InputsComponent={DayOfYearConverterInputs}
    />
  );
}
