import React from "react";
import { Metadata } from "next";
import { timezoneDifferenceGridData } from "@/lib/tools/data/timezone-difference-grid";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import RelativeDiffInputs from "@/components/tools/inputs/RelativeDiffInputs";

export const metadata: Metadata = {
  title: timezoneDifferenceGridData.seo.title,
  description: timezoneDifferenceGridData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${timezoneDifferenceGridData.slug}`,
  },
  openGraph: {
    title: timezoneDifferenceGridData.seo.title,
    description: timezoneDifferenceGridData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${timezoneDifferenceGridData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={timezoneDifferenceGridData}
      InputsComponent={RelativeDiffInputs}
    />
  );
}
