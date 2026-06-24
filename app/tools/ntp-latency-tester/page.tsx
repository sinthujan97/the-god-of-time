import React from "react";
import { Metadata } from "next";
import { ntpLatencyTesterData } from "@/lib/tools/data/ntp-latency-tester";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import NTPLatencyInputs from "@/components/tools/inputs/NTPLatencyInputs";

export const metadata: Metadata = {
  title: ntpLatencyTesterData.seo.title,
  description: ntpLatencyTesterData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${ntpLatencyTesterData.slug}`,
  },
  openGraph: {
    title: ntpLatencyTesterData.seo.title,
    description: ntpLatencyTesterData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${ntpLatencyTesterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={ntpLatencyTesterData}
      InputsComponent={NTPLatencyInputs}
    />
  );
}
