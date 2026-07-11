import React from "react";
import { Metadata } from "next";
import { dateLineSimulatorData } from "@/lib/tools/data/date-line-simulator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import IDLSimulatorInputs from "@/components/tools/inputs/IDLSimulatorInputs";

export const metadata: Metadata = {
  title: dateLineSimulatorData.seo.title,
  description: dateLineSimulatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${dateLineSimulatorData.slug}`,
  },
  openGraph: {
    title: dateLineSimulatorData.seo.title,
    description: dateLineSimulatorData.seo.metaDescription,
    url: `/tools/${dateLineSimulatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={dateLineSimulatorData}
      InputsComponent={IDLSimulatorInputs}
    />
  );
}
