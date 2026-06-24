import React from "react";
import { Metadata } from "next";
import { leapSecondLogData } from "@/lib/tools/data/leap-second-log";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import LeapSecondLogInputs from "@/components/tools/inputs/LeapSecondLogInputs";

export const metadata: Metadata = {
  title: leapSecondLogData.seo.title,
  description: leapSecondLogData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${leapSecondLogData.slug}`,
  },
  openGraph: {
    title: leapSecondLogData.seo.title,
    description: leapSecondLogData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${leapSecondLogData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={leapSecondLogData}
      InputsComponent={LeapSecondLogInputs}
    />
  );
}
