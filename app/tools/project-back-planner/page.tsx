import React from "react";
import { Metadata } from "next";
import { projectBackPlannerData } from "@/lib/tools/data/project-back-planner";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ProjectBackPlannerInputs from "@/components/tools/inputs/ProjectBackPlannerInputs";

export const metadata: Metadata = {
  title: projectBackPlannerData.seo.title,
  description: projectBackPlannerData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${projectBackPlannerData.slug}`,
  },
  openGraph: {
    title: projectBackPlannerData.seo.title,
    description: projectBackPlannerData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${projectBackPlannerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={projectBackPlannerData}
      InputsComponent={ProjectBackPlannerInputs}
    />
  );
}
