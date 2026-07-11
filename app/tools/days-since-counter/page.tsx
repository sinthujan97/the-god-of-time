import React from "react";
import { Metadata } from "next";
import { daysSinceCounterData } from "@/lib/tools/data/days-since-counter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DaysSinceInputs from "@/components/tools/inputs/DaysSinceInputs";

export const metadata: Metadata = {
  title: daysSinceCounterData.seo.title,
  description: daysSinceCounterData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${daysSinceCounterData.slug}`,
  },
  openGraph: {
    title: daysSinceCounterData.seo.title,
    description: daysSinceCounterData.seo.metaDescription,
    url: `/tools/${daysSinceCounterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={daysSinceCounterData}
      InputsComponent={DaysSinceInputs}
    />
  );
}
