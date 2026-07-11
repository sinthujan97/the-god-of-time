import React from "react";
import { Metadata } from "next";
import { criticalPathCalculatorData } from "@/lib/tools/data/critical-path-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import CpmCriticalPathFloatInputs from "@/components/tools/inputs/CpmCriticalPathFloatInputs";

export const metadata: Metadata = {
  title: criticalPathCalculatorData.seo.title,
  description: criticalPathCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${criticalPathCalculatorData.slug}`,
  },
  openGraph: {
    title: criticalPathCalculatorData.seo.title,
    description: criticalPathCalculatorData.seo.metaDescription,
    url: `/tools/${criticalPathCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Critical Path Calculator",
  url: "https://thegodoftime.com/tools/critical-path-calculator",
  description:
    "Free critical path calculator. Find the critical path, float, and project duration for any network of tasks. Works for AON and AOA methods.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Forward and backward pass CPM calculation",
    "Critical path identification",
    "Total and free float calculation",
    "Support for all standard dependency types",
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
        data={criticalPathCalculatorData}
        InputsComponent={CpmCriticalPathFloatInputs}
      />
    </>
  );
}
