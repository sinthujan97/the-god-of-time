import React from "react";
import { Metadata } from "next";
import { daysUntilCounterData } from "@/lib/tools/data/days-until-counter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DaysUntilInputs from "@/components/tools/inputs/DaysUntilInputs";

export const metadata: Metadata = {
  title: daysUntilCounterData.seo.title,
  description: daysUntilCounterData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${daysUntilCounterData.slug}`,
  },
  openGraph: {
    title: daysUntilCounterData.seo.title,
    description: daysUntilCounterData.seo.metaDescription,
    url: `/tools/${daysUntilCounterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={daysUntilCounterData}
      InputsComponent={DaysUntilInputs}
    />
  );
}
