import React from "react";
import { Metadata } from "next";
import { militaryTimeConverterData } from "@/lib/tools/data/military-time-converter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import MilitaryTimeInputs from "@/components/tools/inputs/MilitaryTimeInputs";

export const metadata: Metadata = {
  title: militaryTimeConverterData.seo.title,
  description: militaryTimeConverterData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${militaryTimeConverterData.slug}`,
  },
  openGraph: {
    title: militaryTimeConverterData.seo.title,
    description: militaryTimeConverterData.seo.metaDescription,
    url: `/tools/${militaryTimeConverterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={militaryTimeConverterData}
      InputsComponent={MilitaryTimeInputs}
    />
  );
}
