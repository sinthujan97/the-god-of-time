import React from "react";
import { Metadata } from "next";
import { goldenHourTrackerData } from "@/lib/tools/data/golden-hour-tracker";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import GoldenHourTrackerInputs from "@/components/tools/inputs/GoldenHourTrackerInputs";

export const metadata: Metadata = {
  title: goldenHourTrackerData.seo.title,
  description: goldenHourTrackerData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${goldenHourTrackerData.slug}`,
  },
  openGraph: {
    title: goldenHourTrackerData.seo.title,
    description: goldenHourTrackerData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${goldenHourTrackerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={goldenHourTrackerData}
      InputsComponent={GoldenHourTrackerInputs}
    />
  );
}
