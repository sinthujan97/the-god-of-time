import React from "react";
import { Metadata } from "next";
import { pregnancyDueDateData } from "@/lib/tools/data/pregnancy-due-date";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import PregnancyDueInputs from "@/components/tools/inputs/PregnancyDueInputs";

export const metadata: Metadata = {
  title: pregnancyDueDateData.seo.title,
  description: pregnancyDueDateData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${pregnancyDueDateData.slug}`,
  },
  openGraph: {
    title: pregnancyDueDateData.seo.title,
    description: pregnancyDueDateData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${pregnancyDueDateData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={pregnancyDueDateData}
      InputsComponent={PregnancyDueInputs}
    />
  );
}
