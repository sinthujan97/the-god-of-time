import React from "react";
import { Metadata } from "next";
import { solarVsStandardTimeData } from "@/lib/tools/data/solar-vs-standard-time";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import SolarStandardInputs from "@/components/tools/inputs/SolarStandardInputs";

export const metadata: Metadata = {
  title: solarVsStandardTimeData.seo.title,
  description: solarVsStandardTimeData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${solarVsStandardTimeData.slug}`,
  },
  openGraph: {
    title: solarVsStandardTimeData.seo.title,
    description: solarVsStandardTimeData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${solarVsStandardTimeData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={solarVsStandardTimeData}
      InputsComponent={SolarStandardInputs}
    />
  );
}
