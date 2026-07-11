import React from "react";
import { Metadata } from "next";
import { salaryToHourlyData } from "@/lib/tools/data/salary-to-hourly";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import SalaryToHourlyInputs from "@/components/tools/inputs/SalaryToHourlyInputs";

export const metadata: Metadata = {
  title: salaryToHourlyData.seo.title,
  description: salaryToHourlyData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${salaryToHourlyData.slug}`,
  },
  openGraph: {
    title: salaryToHourlyData.seo.title,
    description: salaryToHourlyData.seo.metaDescription,
    url: `/tools/${salaryToHourlyData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={salaryToHourlyData}
      InputsComponent={SalaryToHourlyInputs}
    />
  );
}
