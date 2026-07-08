import React from "react";
import { Metadata } from "next";
import { leapYearCalculatorData } from "@/lib/tools/data/leap-year-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import LeapYearCheckerInputs from "@/components/tools/inputs/LeapYearCheckerInputs";

export const metadata: Metadata = {
  title: leapYearCalculatorData.seo.title,
  description: leapYearCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${leapYearCalculatorData.slug}`,
  },
  openGraph: {
    title: leapYearCalculatorData.seo.title,
    description: leapYearCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${leapYearCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Leap Year Calculator",
  url: "https://thegodoftime.com/tools/leap-year-calculator",
  description:
    "Free leap year calculator. Check if any year is a leap year, list all leap years in a range, and calculate leap year dates.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Instant single-year leap year check",
    "Leap year range listing",
    "Step-by-step divisibility breakdown",
    "Upcoming leap years list",
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
        data={leapYearCalculatorData}
        InputsComponent={LeapYearCheckerInputs}
      />
    </>
  );
}
