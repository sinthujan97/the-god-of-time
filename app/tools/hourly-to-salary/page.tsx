import React from "react";
import { Metadata } from "next";
import { hourlyToSalaryData } from "@/lib/tools/data/hourly-to-salary";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import HourlyToSalaryInputs from "@/components/tools/inputs/HourlyToSalaryInputs";

export const metadata: Metadata = {
  title: hourlyToSalaryData.seo.title,
  description: hourlyToSalaryData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${hourlyToSalaryData.slug}`,
  },
  openGraph: {
    title: hourlyToSalaryData.seo.title,
    description: hourlyToSalaryData.seo.metaDescription,
    url: `/tools/${hourlyToSalaryData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={hourlyToSalaryData}
      InputsComponent={HourlyToSalaryInputs}
    />
  );
}
