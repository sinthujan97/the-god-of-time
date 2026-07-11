import React from "react";
import { Metadata } from "next";
import { alcoholClearanceData } from "@/lib/tools/data/alcohol-clearance";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import AlcoholClearanceInputs from "@/components/tools/inputs/AlcoholClearanceInputs";

export const metadata: Metadata = {
  title: alcoholClearanceData.seo.title,
  description: alcoholClearanceData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${alcoholClearanceData.slug}`,
  },
  openGraph: {
    title: alcoholClearanceData.seo.title,
    description: alcoholClearanceData.seo.metaDescription,
    url: `/tools/${alcoholClearanceData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={alcoholClearanceData}
      InputsComponent={AlcoholClearanceInputs}
    />
  );
}
