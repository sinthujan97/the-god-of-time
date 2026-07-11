import React from "react";
import { Metadata } from "next";
import { medicationSchedulerData } from "@/lib/tools/data/medication-scheduler";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import MedicationSchedulerInputs from "@/components/tools/inputs/MedicationSchedulerInputs";

export const metadata: Metadata = {
  title: medicationSchedulerData.seo.title,
  description: medicationSchedulerData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${medicationSchedulerData.slug}`,
  },
  openGraph: {
    title: medicationSchedulerData.seo.title,
    description: medicationSchedulerData.seo.metaDescription,
    url: `/tools/${medicationSchedulerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={medicationSchedulerData}
      InputsComponent={MedicationSchedulerInputs}
    />
  );
}
