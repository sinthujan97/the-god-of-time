import React from "react";
import { Metadata } from "next";
import { biweeklyTimesheetData } from "@/lib/tools/data/biweekly-timesheet";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import BiweeklyTimesheetInputs from "@/components/tools/inputs/BiweeklyTimesheetInputs";

export const metadata: Metadata = {
  title: biweeklyTimesheetData.seo.title,
  description: biweeklyTimesheetData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${biweeklyTimesheetData.slug}`,
  },
  openGraph: {
    title: biweeklyTimesheetData.seo.title,
    description: biweeklyTimesheetData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${biweeklyTimesheetData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={biweeklyTimesheetData}
      InputsComponent={BiweeklyTimesheetInputs}
    />
  );
}
