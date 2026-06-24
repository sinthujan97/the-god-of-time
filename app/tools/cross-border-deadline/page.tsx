import React from "react";
import { Metadata } from "next";
import { crossBorderDeadlineData } from "@/lib/tools/data/cross-border-deadline";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DeadlineMatcherInputs from "@/components/tools/inputs/DeadlineMatcherInputs";

export const metadata: Metadata = {
  title: crossBorderDeadlineData.seo.title,
  description: crossBorderDeadlineData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${crossBorderDeadlineData.slug}`,
  },
  openGraph: {
    title: crossBorderDeadlineData.seo.title,
    description: crossBorderDeadlineData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${crossBorderDeadlineData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={crossBorderDeadlineData}
      InputsComponent={DeadlineMatcherInputs}
    />
  );
}
