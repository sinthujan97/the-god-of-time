import React from "react";
import { Metadata } from "next";
import { addDaysToDateData } from "@/lib/tools/data/add-days-to-date";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import AddDaysToDateInputs from "@/components/tools/inputs/AddDaysToDateInputs";

export const metadata: Metadata = {
  title: addDaysToDateData.seo.title,
  description: addDaysToDateData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${addDaysToDateData.slug}`,
  },
  openGraph: {
    title: addDaysToDateData.seo.title,
    description: addDaysToDateData.seo.metaDescription,
    url: `/tools/${addDaysToDateData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={addDaysToDateData}
      InputsComponent={AddDaysToDateInputs}
    />
  );
}
