import React from "react";
import { Metadata } from "next";
import { annualWorkHoursData } from "@/lib/tools/data/annual-work-hours";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import AnnualWorkHoursInputs from "@/components/tools/inputs/AnnualWorkHoursInputs";

export const metadata: Metadata = {
  title: annualWorkHoursData.seo.title,
  description: annualWorkHoursData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${annualWorkHoursData.slug}`,
  },
  openGraph: {
    title: annualWorkHoursData.seo.title,
    description: annualWorkHoursData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${annualWorkHoursData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={annualWorkHoursData}
      InputsComponent={AnnualWorkHoursInputs}
    />
  );
}
