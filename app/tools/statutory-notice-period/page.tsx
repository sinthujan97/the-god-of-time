import React from "react";
import { Metadata } from "next";
import { statutoryNoticePeriodData } from "@/lib/tools/data/statutory-notice-period";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import StatutoryNoticePeriodInputs from "@/components/tools/inputs/StatutoryNoticePeriodInputs";

export const metadata: Metadata = {
  title: statutoryNoticePeriodData.seo.title,
  description: statutoryNoticePeriodData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${statutoryNoticePeriodData.slug}`,
  },
  openGraph: {
    title: statutoryNoticePeriodData.seo.title,
    description: statutoryNoticePeriodData.seo.metaDescription,
    url: `/tools/${statutoryNoticePeriodData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={statutoryNoticePeriodData}
      InputsComponent={StatutoryNoticePeriodInputs}
    />
  );
}
