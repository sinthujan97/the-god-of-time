import React from "react";
import { Metadata } from "next";
import { utcGmtOffsetData } from "@/lib/tools/data/utc-gmt-offset";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import UtcGmtOffsetFinderInputs from "@/components/tools/inputs/UtcGmtOffsetFinderInputs";

export const metadata: Metadata = {
  title: utcGmtOffsetData.seo.title,
  description: utcGmtOffsetData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${utcGmtOffsetData.slug}`,
  },
  openGraph: {
    title: utcGmtOffsetData.seo.title,
    description: utcGmtOffsetData.seo.metaDescription,
    url: `/tools/${utcGmtOffsetData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={utcGmtOffsetData}
      InputsComponent={UtcGmtOffsetFinderInputs}
    />
  );
}
