import React from "react";
import { Metadata } from "next";
import { courtDeadlineCalculatorData } from "@/lib/tools/data/court-deadline-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import CourtDeadlineCalculatorInputs from "@/components/tools/inputs/CourtDeadlineCalculatorInputs";

export const metadata: Metadata = {
  title: courtDeadlineCalculatorData.seo.title,
  description: courtDeadlineCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${courtDeadlineCalculatorData.slug}`,
  },
  openGraph: {
    title: courtDeadlineCalculatorData.seo.title,
    description: courtDeadlineCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${courtDeadlineCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={courtDeadlineCalculatorData}
      InputsComponent={CourtDeadlineCalculatorInputs}
    />
  );
}
