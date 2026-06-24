import React from "react";
import { Metadata } from "next";
import { screenBreakTimerData } from "@/lib/tools/data/screen-break-timer";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ScreenBreakTimerInputs from "@/components/tools/inputs/ScreenBreakTimerInputs";

export const metadata: Metadata = {
  title: screenBreakTimerData.seo.title,
  description: screenBreakTimerData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${screenBreakTimerData.slug}`,
  },
  openGraph: {
    title: screenBreakTimerData.seo.title,
    description: screenBreakTimerData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${screenBreakTimerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={screenBreakTimerData}
      InputsComponent={ScreenBreakTimerInputs}
    />
  );
}
