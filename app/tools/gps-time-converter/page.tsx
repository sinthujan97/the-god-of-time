import React from "react";
import { Metadata } from "next";
import { gpsTimeConverterData } from "@/lib/tools/data/gps-time-converter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import GPSTimeInputs from "@/components/tools/inputs/GPSTimeInputs";

export const metadata: Metadata = {
  title: gpsTimeConverterData.seo.title,
  description: gpsTimeConverterData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${gpsTimeConverterData.slug}`,
  },
  openGraph: {
    title: gpsTimeConverterData.seo.title,
    description: gpsTimeConverterData.seo.metaDescription,
    url: `/tools/${gpsTimeConverterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GPS Time Converter",
  url: "https://thegodoftime.com/tools/gps-time-converter",
  description:
    "Free GPS time converter. Convert GPS time to UTC, Unix time, or local time. Handles leap seconds and GPS week rollover.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "GPS time to UTC conversion",
    "Leap second correction handling",
    "GPS week number rollover support",
    "Unix timestamp conversion",
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
        data={gpsTimeConverterData}
        InputsComponent={GPSTimeInputs}
      />
    </>
  );
}
