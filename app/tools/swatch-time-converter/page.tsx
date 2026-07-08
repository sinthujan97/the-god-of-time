import React from "react";
import { Metadata } from "next";
import { swatchTimeConverterData } from "@/lib/tools/data/swatch-time-converter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import InternetTimeInputs from "@/components/tools/inputs/InternetTimeInputs";

export const metadata: Metadata = {
  title: swatchTimeConverterData.seo.title,
  description: swatchTimeConverterData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${swatchTimeConverterData.slug}`,
  },
  openGraph: {
    title: swatchTimeConverterData.seo.title,
    description: swatchTimeConverterData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${swatchTimeConverterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Swatch Time Converter",
  url: "https://thegodoftime.com/tools/swatch-time-converter",
  description:
    "Free Swatch internet time converter. Convert standard time to .beats and back. The quirky 1990s universal time format explained and calculated.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Standard time to Swatch .beats conversion",
    "Live ticking beat clock",
    "Biel Mean Time (BMT) equivalents",
    "Historical and future time conversion",
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
        data={swatchTimeConverterData}
        InputsComponent={InternetTimeInputs}
      />
    </>
  );
}
