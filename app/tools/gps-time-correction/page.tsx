import React from "react";
import { Metadata } from "next";
import { gpsTimeCorrectionData } from "@/lib/tools/data/gps-time-correction";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import GPSTimeInputs from "@/components/tools/inputs/GPSTimeInputs";

export const metadata: Metadata = {
  title: gpsTimeCorrectionData.seo.title,
  description: gpsTimeCorrectionData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${gpsTimeCorrectionData.slug}`,
  },
  openGraph: {
    title: gpsTimeCorrectionData.seo.title,
    description: gpsTimeCorrectionData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${gpsTimeCorrectionData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={gpsTimeCorrectionData}
      InputsComponent={GPSTimeInputs}
    />
  );
}
