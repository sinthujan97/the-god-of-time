import React from "react";
import { Metadata } from "next";
import { shiftDifferentialCalculatorData } from "@/lib/tools/data/shift-differential-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ShiftDifferentialInputs from "@/components/tools/inputs/ShiftDifferentialInputs";

export const metadata: Metadata = {
  title: shiftDifferentialCalculatorData.seo.title,
  description: shiftDifferentialCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${shiftDifferentialCalculatorData.slug}`,
  },
  openGraph: {
    title: shiftDifferentialCalculatorData.seo.title,
    description: shiftDifferentialCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${shiftDifferentialCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Shift Differential Calculator",
  url: "https://thegodoftime.com/tools/shift-differential-calculator",
  description:
    "Free shift differential calculator for computing night shift pay, differential rates, and overtime",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Night shift differential calculation",
    "Overtime with differential support",
    "Holiday pay calculation",
    "Percentage and flat rate modes",
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
        data={shiftDifferentialCalculatorData}
        InputsComponent={ShiftDifferentialInputs}
      />
    </>
  );
}
