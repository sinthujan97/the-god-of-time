import React from "react";
import { Metadata } from "next";
import { fastingPlannerData } from "@/lib/tools/data/fasting-planner";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import FastingPlannerInputs from "@/components/tools/inputs/FastingPlannerInputs";

export const metadata: Metadata = {
  title: fastingPlannerData.seo.title,
  description: fastingPlannerData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${fastingPlannerData.slug}`,
  },
  openGraph: {
    title: fastingPlannerData.seo.title,
    description: fastingPlannerData.seo.metaDescription,
    url: `/tools/${fastingPlannerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={fastingPlannerData}
      InputsComponent={FastingPlannerInputs}
    />
  );
}
