import React from "react";
import { Metadata } from "next";
import { freelanceCapacityPlannerData } from "@/lib/tools/data/freelance-capacity-planner";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import FreelanceCapacityInputs from "@/components/tools/inputs/FreelanceCapacityInputs";

export const metadata: Metadata = {
  title: freelanceCapacityPlannerData.seo.title,
  description: freelanceCapacityPlannerData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${freelanceCapacityPlannerData.slug}`,
  },
  openGraph: {
    title: freelanceCapacityPlannerData.seo.title,
    description: freelanceCapacityPlannerData.seo.metaDescription,
    url: `/tools/${freelanceCapacityPlannerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={freelanceCapacityPlannerData}
      InputsComponent={FreelanceCapacityInputs}
    />
  );
}
