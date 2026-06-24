import React from "react";
import { Metadata } from "next";
import { timezoneMapFinderData } from "@/lib/tools/data/timezone-map-finder";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import MapClickInputs from "@/components/tools/inputs/MapClickInputs";

export const metadata: Metadata = {
  title: timezoneMapFinderData.seo.title,
  description: timezoneMapFinderData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${timezoneMapFinderData.slug}`,
  },
  openGraph: {
    title: timezoneMapFinderData.seo.title,
    description: timezoneMapFinderData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${timezoneMapFinderData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={timezoneMapFinderData}
      InputsComponent={MapClickInputs}
    />
  );
}
