import React from "react";
import { Metadata } from "next";
import { solarNoonTrackerData } from "@/lib/tools/data/solar-noon-tracker";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import TrueSolarNoonInputs from "@/components/tools/inputs/TrueSolarNoonInputs";

export const metadata: Metadata = {
  title: solarNoonTrackerData.seo.title,
  description: solarNoonTrackerData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${solarNoonTrackerData.slug}`,
  },
  openGraph: {
    title: solarNoonTrackerData.seo.title,
    description: solarNoonTrackerData.seo.metaDescription,
    url: `/tools/${solarNoonTrackerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={solarNoonTrackerData}
      InputsComponent={TrueSolarNoonInputs}
    />
  );
}
