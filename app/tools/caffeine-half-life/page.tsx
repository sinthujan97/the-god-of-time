import React from "react";
import { Metadata } from "next";
import { caffeineHalfLifeData } from "@/lib/tools/data/caffeine-half-life";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import CaffeineHalfLifeInputs from "@/components/tools/inputs/CaffeineHalfLifeInputs";

export const metadata: Metadata = {
  title: caffeineHalfLifeData.seo.title,
  description: caffeineHalfLifeData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${caffeineHalfLifeData.slug}`,
  },
  openGraph: {
    title: caffeineHalfLifeData.seo.title,
    description: caffeineHalfLifeData.seo.metaDescription,
    url: `/tools/${caffeineHalfLifeData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={caffeineHalfLifeData}
      InputsComponent={CaffeineHalfLifeInputs}
    />
  );
}
