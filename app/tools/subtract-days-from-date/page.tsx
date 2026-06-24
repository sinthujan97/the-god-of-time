import React from "react";
import { Metadata } from "next";
import { subtractDaysFromDateData } from "@/lib/tools/data/subtract-days-from-date";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import SubtractDaysInputs from "@/components/tools/inputs/SubtractDaysInputs";

export const metadata: Metadata = {
  title: subtractDaysFromDateData.seo.title,
  description: subtractDaysFromDateData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${subtractDaysFromDateData.slug}`,
  },
  openGraph: {
    title: subtractDaysFromDateData.seo.title,
    description: subtractDaysFromDateData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${subtractDaysFromDateData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={subtractDaysFromDateData}
      InputsComponent={SubtractDaysInputs}
    />
  );
}
