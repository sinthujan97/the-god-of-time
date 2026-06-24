import React from "react";
import { Metadata } from "next";
import { timezoneAbbreviationsData } from "@/lib/tools/data/timezone-abbreviations";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import AbbreviationDirectoryInputs from "@/components/tools/inputs/AbbreviationDirectoryInputs";

export const metadata: Metadata = {
  title: timezoneAbbreviationsData.seo.title,
  description: timezoneAbbreviationsData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${timezoneAbbreviationsData.slug}`,
  },
  openGraph: {
    title: timezoneAbbreviationsData.seo.title,
    description: timezoneAbbreviationsData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${timezoneAbbreviationsData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={timezoneAbbreviationsData}
      InputsComponent={AbbreviationDirectoryInputs}
    />
  );
}
