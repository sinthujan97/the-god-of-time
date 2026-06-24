import React from "react";
import { Metadata } from "next";
import { shiftSleepAdjusterData } from "@/lib/tools/data/shift-sleep-adjuster";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ShiftSleepAdjusterInputs from "@/components/tools/inputs/ShiftSleepAdjusterInputs";

export const metadata: Metadata = {
  title: shiftSleepAdjusterData.seo.title,
  description: shiftSleepAdjusterData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${shiftSleepAdjusterData.slug}`,
  },
  openGraph: {
    title: shiftSleepAdjusterData.seo.title,
    description: shiftSleepAdjusterData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${shiftSleepAdjusterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={shiftSleepAdjusterData}
      InputsComponent={ShiftSleepAdjusterInputs}
    />
  );
}
