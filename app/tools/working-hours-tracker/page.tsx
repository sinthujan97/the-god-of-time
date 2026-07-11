import React from "react";
import { Metadata } from "next";
import { workingHoursTrackerData } from "@/lib/tools/data/working-hours-tracker";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import WorkingHoursTrackerInputs from "@/components/tools/inputs/WorkingHoursTrackerInputs";

export const metadata: Metadata = {
  title: workingHoursTrackerData.seo.title,
  description: workingHoursTrackerData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${workingHoursTrackerData.slug}`,
  },
  openGraph: {
    title: workingHoursTrackerData.seo.title,
    description: workingHoursTrackerData.seo.metaDescription,
    url: `/tools/${workingHoursTrackerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={workingHoursTrackerData}
      InputsComponent={WorkingHoursTrackerInputs}
    />
  );
}
