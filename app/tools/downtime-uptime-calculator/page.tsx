import React from "react";
import { Metadata } from "next";
import { downtimeUptimeCalculatorData } from "@/lib/tools/data/downtime-uptime-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DowntimeUptimeCalculatorInputs from "@/components/tools/inputs/DowntimeUptimeCalculatorInputs";

export const metadata: Metadata = {
  title: downtimeUptimeCalculatorData.seo.title,
  description: downtimeUptimeCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${downtimeUptimeCalculatorData.slug}`,
  },
  openGraph: {
    title: downtimeUptimeCalculatorData.seo.title,
    description: downtimeUptimeCalculatorData.seo.metaDescription,
    url: `/tools/${downtimeUptimeCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={downtimeUptimeCalculatorData}
      InputsComponent={DowntimeUptimeCalculatorInputs}
    />
  );
}
