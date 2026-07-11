import React from "react";
import { Metadata } from "next";
import { breakDeductorData } from "@/lib/tools/data/break-deductor";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import BreakDeductorInputs from "@/components/tools/inputs/BreakDeductorInputs";

export const metadata: Metadata = {
  title: breakDeductorData.seo.title,
  description: breakDeductorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${breakDeductorData.slug}`,
  },
  openGraph: {
    title: breakDeductorData.seo.title,
    description: breakDeductorData.seo.metaDescription,
    url: `/tools/${breakDeductorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={breakDeductorData}
      InputsComponent={BreakDeductorInputs}
    />
  );
}
