import React from "react";
import { Metadata } from "next";
import { zuluTimeCoordinatorData } from "@/lib/tools/data/zulu-time-coordinator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ZuluCoordinatorInputs from "@/components/tools/inputs/ZuluCoordinatorInputs";

export const metadata: Metadata = {
  title: zuluTimeCoordinatorData.seo.title,
  description: zuluTimeCoordinatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${zuluTimeCoordinatorData.slug}`,
  },
  openGraph: {
    title: zuluTimeCoordinatorData.seo.title,
    description: zuluTimeCoordinatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${zuluTimeCoordinatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={zuluTimeCoordinatorData}
      InputsComponent={ZuluCoordinatorInputs}
    />
  );
}
