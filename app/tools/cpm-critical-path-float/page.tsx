import React from "react";
import { Metadata } from "next";
import { cpmCriticalPathFloatData } from "@/lib/tools/data/cpm-critical-path-float";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import CpmCriticalPathFloatInputs from "@/components/tools/inputs/CpmCriticalPathFloatInputs";

export const metadata: Metadata = {
  title: cpmCriticalPathFloatData.seo.title,
  description: cpmCriticalPathFloatData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${cpmCriticalPathFloatData.slug}`,
  },
  openGraph: {
    title: cpmCriticalPathFloatData.seo.title,
    description: cpmCriticalPathFloatData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${cpmCriticalPathFloatData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={cpmCriticalPathFloatData}
      InputsComponent={CpmCriticalPathFloatInputs}
    />
  );
}
