import React from "react";
import { Metadata } from "next";
import { leapYearCheckerData } from "@/lib/tools/data/leap-year-checker";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import LeapYearCheckerInputs from "@/components/tools/inputs/LeapYearCheckerInputs";

export const metadata: Metadata = {
  title: leapYearCheckerData.seo.title,
  description: leapYearCheckerData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${leapYearCheckerData.slug}`,
  },
  openGraph: {
    title: leapYearCheckerData.seo.title,
    description: leapYearCheckerData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${leapYearCheckerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={leapYearCheckerData}
      InputsComponent={LeapYearCheckerInputs}
    />
  );
}
