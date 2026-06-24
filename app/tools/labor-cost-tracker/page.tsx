import React from "react";
import { Metadata } from "next";
import { laborCostTrackerData } from "@/lib/tools/data/labor-cost-tracker";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import LaborCostInputs from "@/components/tools/inputs/LaborCostInputs";

export const metadata: Metadata = {
  title: laborCostTrackerData.seo.title,
  description: laborCostTrackerData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${laborCostTrackerData.slug}`,
  },
  openGraph: {
    title: laborCostTrackerData.seo.title,
    description: laborCostTrackerData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${laborCostTrackerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={laborCostTrackerData}
      InputsComponent={LaborCostInputs}
    />
  );
}
