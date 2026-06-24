import React from "react";
import { Metadata } from "next";
import { isoWeekNumberData } from "@/lib/tools/data/iso-week-number";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import IsoWeekNumberInputs from "@/components/tools/inputs/IsoWeekNumberInputs";

export const metadata: Metadata = {
  title: isoWeekNumberData.seo.title,
  description: isoWeekNumberData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${isoWeekNumberData.slug}`,
  },
  openGraph: {
    title: isoWeekNumberData.seo.title,
    description: isoWeekNumberData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${isoWeekNumberData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={isoWeekNumberData}
      InputsComponent={IsoWeekNumberInputs}
    />
  );
}
