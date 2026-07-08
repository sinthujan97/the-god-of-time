import React from "react";
import { Metadata } from "next";
import { fiscalQuarterCalculatorData } from "@/lib/tools/data/fiscal-quarter-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import FiscalQuarterCalculatorInputs from "@/components/tools/inputs/FiscalQuarterCalculatorInputs";

export const metadata: Metadata = {
  title: fiscalQuarterCalculatorData.seo.title,
  description: fiscalQuarterCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${fiscalQuarterCalculatorData.slug}`,
  },
  openGraph: {
    title: fiscalQuarterCalculatorData.seo.title,
    description: fiscalQuarterCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${fiscalQuarterCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fiscal Quarter Calculator",
  url: "https://thegodoftime.com/tools/fiscal-quarter-calculator",
  description:
    "Free fiscal quarter calculator. Find Q1-Q4 dates for any fiscal year start month. Calculate current quarter, add or subtract quarters.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Custom fiscal year start month support",
    "Q1-Q4 start and end date calculation",
    "Add or subtract quarters from a date",
    "Current fiscal quarter lookup",
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
        data={fiscalQuarterCalculatorData}
        InputsComponent={FiscalQuarterCalculatorInputs}
      />
    </>
  );
}
