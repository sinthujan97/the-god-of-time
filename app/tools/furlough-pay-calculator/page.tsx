import React from "react";
import { Metadata } from "next";
import { furloughPayCalculatorData } from "@/lib/tools/data/furlough-pay-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import FurloughPayInputs from "@/components/tools/inputs/FurloughPayInputs";

export const metadata: Metadata = {
  title: furloughPayCalculatorData.seo.title,
  description: furloughPayCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${furloughPayCalculatorData.slug}`,
  },
  openGraph: {
    title: furloughPayCalculatorData.seo.title,
    description: furloughPayCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${furloughPayCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Furlough Pay Calculator",
  url: "https://thegodoftime.com/tools/furlough-pay-calculator",
  description:
    "Free furlough pay calculator. Calculate income loss from unpaid furlough days, adjusted monthly salary, and equivalent annual pay.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Monthly income loss calculation",
    "Total furlough program cost projection",
    "Adjusted annual salary equivalent",
    "Percentage pay reduction display",
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
        data={furloughPayCalculatorData}
        InputsComponent={FurloughPayInputs}
      />
    </>
  );
}
