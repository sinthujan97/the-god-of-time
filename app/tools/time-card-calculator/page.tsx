import React from "react";
import { Metadata } from "next";
import { timeCardCalculatorData } from "@/lib/tools/data/time-card-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import TimeCardInputs from "@/components/tools/inputs/TimeCardInputs";

export const metadata: Metadata = {
  title: timeCardCalculatorData.seo.title,
  description: timeCardCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${timeCardCalculatorData.slug}`,
  },
  openGraph: {
    title: timeCardCalculatorData.seo.title,
    description: timeCardCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${timeCardCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Time Card Calculator",
  url: `https://thegodoftime.com/tools/${timeCardCalculatorData.slug}`,
  description: timeCardCalculatorData.description,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function ToolPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <ToolPageTemplate
        data={timeCardCalculatorData}
        InputsComponent={TimeCardInputs}
      />
    </>
  );
}
