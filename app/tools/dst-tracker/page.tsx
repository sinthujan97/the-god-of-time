import React from "react";
import { Metadata } from "next";
import { dstTrackerData } from "@/lib/tools/data/dst-tracker";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DSTTrackerInputs from "@/components/tools/inputs/DSTTrackerInputs";

export const metadata: Metadata = {
  title: dstTrackerData.seo.title,
  description: dstTrackerData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${dstTrackerData.slug}`,
  },
  openGraph: {
    title: dstTrackerData.seo.title,
    description: dstTrackerData.seo.metaDescription,
    url: `/tools/${dstTrackerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={dstTrackerData}
      InputsComponent={DSTTrackerInputs}
    />
  );
}
