import React from "react";
import { Metadata } from "next";
import { zuluTimeConverterData } from "@/lib/tools/data/zulu-time-converter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ZuluCoordinatorInputs from "@/components/tools/inputs/ZuluCoordinatorInputs";

export const metadata: Metadata = {
  title: zuluTimeConverterData.seo.title,
  description: zuluTimeConverterData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${zuluTimeConverterData.slug}`,
  },
  openGraph: {
    title: zuluTimeConverterData.seo.title,
    description: zuluTimeConverterData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${zuluTimeConverterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Zulu Time Converter",
  url: "https://thegodoftime.com/tools/zulu-time-converter",
  description:
    "Free zulu time converter. Convert local time to zulu time instantly. Used by pilots, military, and aviation professionals.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Local time to Zulu (UTC) conversion",
    "Aviation-standard notation display",
    "Live synchronization with device clock",
    "ISO 8601 timestamp output",
  ],
};

export default function ToolPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <ToolPageTemplate
        data={zuluTimeConverterData}
        InputsComponent={ZuluCoordinatorInputs}
      />
    </>
  );
}
