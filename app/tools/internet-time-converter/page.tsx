import React from "react";
import { Metadata } from "next";
import { internetTimeConverterData } from "@/lib/tools/data/internet-time-converter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import InternetTimeInputs from "@/components/tools/inputs/InternetTimeInputs";

export const metadata: Metadata = {
  title: internetTimeConverterData.seo.title,
  description: internetTimeConverterData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${internetTimeConverterData.slug}`,
  },
  openGraph: {
    title: internetTimeConverterData.seo.title,
    description: internetTimeConverterData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${internetTimeConverterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={internetTimeConverterData}
      InputsComponent={InternetTimeInputs}
    />
  );
}
