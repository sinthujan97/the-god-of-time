import React from "react";
import { Metadata } from "next";
import { addSubtractTimeData } from "@/lib/tools/data/add-subtract-time";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import AddSubtractTimeInputs from "@/components/tools/inputs/AddSubtractTimeInputs";

export const metadata: Metadata = {
  title: addSubtractTimeData.seo.title,
  description: addSubtractTimeData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${addSubtractTimeData.slug}`,
  },
  openGraph: {
    title: addSubtractTimeData.seo.title,
    description: addSubtractTimeData.seo.metaDescription,
    url: `/tools/${addSubtractTimeData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={addSubtractTimeData}
      InputsComponent={AddSubtractTimeInputs}
    />
  );
}
