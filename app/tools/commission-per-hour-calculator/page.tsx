import React from "react";
import { Metadata } from "next";
import { commissionPerHourCalculatorData } from "@/lib/tools/data/commission-per-hour-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import CommissionByHourInputs from "@/components/tools/inputs/CommissionByHourInputs";

export const metadata: Metadata = {
  title: commissionPerHourCalculatorData.seo.title,
  description: commissionPerHourCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${commissionPerHourCalculatorData.slug}`,
  },
  openGraph: {
    title: commissionPerHourCalculatorData.seo.title,
    description: commissionPerHourCalculatorData.seo.metaDescription,
    url: `/tools/${commissionPerHourCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Commission Per Hour Calculator",
  url: "https://thegodoftime.com/tools/commission-per-hour-calculator",
  description:
    "Free commission per hour calculator. Convert sales commissions into hourly equivalents and calculate your true blended hourly rate including base pay.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Commission to hourly rate conversion",
    "Base salary plus commission blended rate",
    "Commission percentage of total pay",
    "Break-even hours calculation",
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
        data={commissionPerHourCalculatorData}
        InputsComponent={CommissionByHourInputs}
      />
    </>
  );
}
