import React from "react";
import { Metadata } from "next";
import { interestDayCountData } from "@/lib/tools/data/interest-day-count";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import InterestDayCountInputs from "@/components/tools/inputs/InterestDayCountInputs";

export const metadata: Metadata = {
  title: interestDayCountData.seo.title,
  description: interestDayCountData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${interestDayCountData.slug}`,
  },
  openGraph: {
    title: interestDayCountData.seo.title,
    description: interestDayCountData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${interestDayCountData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={interestDayCountData}
      InputsComponent={InterestDayCountInputs}
    />
  );
}
