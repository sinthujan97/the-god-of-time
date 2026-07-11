import React from "react";
import { Metadata } from "next";
import { millisecondTimerData } from "@/lib/tools/data/millisecond-timer";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import MillisecondTimerInputs from "@/components/tools/inputs/MillisecondTimerInputs";

export const metadata: Metadata = {
  title: millisecondTimerData.seo.title,
  description: millisecondTimerData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${millisecondTimerData.slug}`,
  },
  openGraph: {
    title: millisecondTimerData.seo.title,
    description: millisecondTimerData.seo.metaDescription,
    url: `/tools/${millisecondTimerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={millisecondTimerData}
      InputsComponent={MillisecondTimerInputs}
    />
  );
}
