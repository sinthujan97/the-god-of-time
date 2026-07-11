import React from "react";
import { Metadata } from "next";
import { billableHoursTrackerData } from "@/lib/tools/data/billable-hours-tracker";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import BillableHoursInputs from "@/components/tools/inputs/BillableHoursInputs";

export const metadata: Metadata = {
  title: billableHoursTrackerData.seo.title,
  description: billableHoursTrackerData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${billableHoursTrackerData.slug}`,
  },
  openGraph: {
    title: billableHoursTrackerData.seo.title,
    description: billableHoursTrackerData.seo.metaDescription,
    url: `/tools/${billableHoursTrackerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={billableHoursTrackerData}
      InputsComponent={BillableHoursInputs}
    />
  );
}
