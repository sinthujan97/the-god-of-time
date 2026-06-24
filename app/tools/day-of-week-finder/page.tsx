import React from "react";
import { Metadata } from "next";
import { dayOfWeekFinderData } from "@/lib/tools/data/day-of-week-finder";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DayOfWeekFinderInputs from "@/components/tools/inputs/DayOfWeekFinderInputs";

export const metadata: Metadata = {
  title: dayOfWeekFinderData.seo.title,
  description: dayOfWeekFinderData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${dayOfWeekFinderData.slug}`,
  },
  openGraph: {
    title: dayOfWeekFinderData.seo.title,
    description: dayOfWeekFinderData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${dayOfWeekFinderData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={dayOfWeekFinderData}
      InputsComponent={DayOfWeekFinderInputs}
    />
  );
}
