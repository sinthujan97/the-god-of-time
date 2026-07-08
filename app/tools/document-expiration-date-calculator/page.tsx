import React from "react";
import { Metadata } from "next";
import { documentExpirationDateCalculatorData } from "@/lib/tools/data/document-expiration-date-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DocumentRetentionExpiryInputs from "@/components/tools/inputs/DocumentRetentionExpiryInputs";

export const metadata: Metadata = {
  title: documentExpirationDateCalculatorData.seo.title,
  description: documentExpirationDateCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${documentExpirationDateCalculatorData.slug}`,
  },
  openGraph: {
    title: documentExpirationDateCalculatorData.seo.title,
    description: documentExpirationDateCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${documentExpirationDateCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Document Expiration Date Calculator",
  url: "https://thegodoftime.com/tools/document-expiration-date-calculator",
  description:
    "Free document expiration date calculator. Find when any document expires based on issue date and validity period.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Expiration date calculation from issue date and validity period",
    "Days remaining until expiry",
    "Common document validity period reference",
    "Compliance and retention date tracking",
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
        data={documentExpirationDateCalculatorData}
        InputsComponent={DocumentRetentionExpiryInputs}
      />
    </>
  );
}
