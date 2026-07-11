import React from "react";
import { Metadata } from "next";
import { businessDaysWithHolidaysData } from "@/lib/tools/data/business-days-with-holidays";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import BusinessDaysWithHolidaysInputs from "@/components/tools/inputs/BusinessDaysWithHolidaysInputs";

export const metadata: Metadata = {
  title: businessDaysWithHolidaysData.seo.title,
  description: businessDaysWithHolidaysData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${businessDaysWithHolidaysData.slug}`,
  },
  openGraph: {
    title: businessDaysWithHolidaysData.seo.title,
    description: businessDaysWithHolidaysData.seo.metaDescription,
    url: `/tools/${businessDaysWithHolidaysData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={businessDaysWithHolidaysData}
      InputsComponent={BusinessDaysWithHolidaysInputs}
    />
  );
}
