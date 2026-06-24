import React from "react";
import { Metadata } from "next";
import { nicotineDetoxData } from "@/lib/tools/data/nicotine-detox";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import NicotineDetoxInputs from "@/components/tools/inputs/NicotineDetoxInputs";

export const metadata: Metadata = {
  title: nicotineDetoxData.seo.title,
  description: nicotineDetoxData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${nicotineDetoxData.slug}`,
  },
  openGraph: {
    title: nicotineDetoxData.seo.title,
    description: nicotineDetoxData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${nicotineDetoxData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={nicotineDetoxData}
      InputsComponent={NicotineDetoxInputs}
    />
  );
}
