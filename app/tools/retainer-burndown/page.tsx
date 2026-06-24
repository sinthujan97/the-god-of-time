import React from "react";
import { Metadata } from "next";
import { retainerBurndownData } from "@/lib/tools/data/retainer-burndown";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import RetainerBurndownInputs from "@/components/tools/inputs/RetainerBurndownInputs";

export const metadata: Metadata = {
  title: retainerBurndownData.seo.title,
  description: retainerBurndownData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${retainerBurndownData.slug}`,
  },
  openGraph: {
    title: retainerBurndownData.seo.title,
    description: retainerBurndownData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${retainerBurndownData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={retainerBurndownData}
      InputsComponent={RetainerBurndownInputs}
    />
  );
}
