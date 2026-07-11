import React from "react";
import { Metadata } from "next";
import { vaccinationTrackerData } from "@/lib/tools/data/vaccination-tracker";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import VaccinationTrackerInputs from "@/components/tools/inputs/VaccinationTrackerInputs";

export const metadata: Metadata = {
  title: vaccinationTrackerData.seo.title,
  description: vaccinationTrackerData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${vaccinationTrackerData.slug}`,
  },
  openGraph: {
    title: vaccinationTrackerData.seo.title,
    description: vaccinationTrackerData.seo.metaDescription,
    url: `/tools/${vaccinationTrackerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={vaccinationTrackerData}
      InputsComponent={VaccinationTrackerInputs}
    />
  );
}
