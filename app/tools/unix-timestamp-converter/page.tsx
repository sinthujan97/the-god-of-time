import React from "react";
import { Metadata } from "next";
import { unixTimestampConverterData } from "@/lib/tools/data/unix-timestamp-converter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import UnixTimestampInputs from "@/components/tools/inputs/UnixTimestampInputs";

export const metadata: Metadata = {
  title: unixTimestampConverterData.seo.title,
  description: unixTimestampConverterData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${unixTimestampConverterData.slug}`,
  },
  openGraph: {
    title: unixTimestampConverterData.seo.title,
    description: unixTimestampConverterData.seo.metaDescription,
    url: `/tools/${unixTimestampConverterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={unixTimestampConverterData}
      InputsComponent={UnixTimestampInputs}
    />
  );
}
