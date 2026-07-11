import React from "react";
import { Metadata } from "next";
import { freeBiweeklyTimesheetCalculatorData } from "@/lib/tools/data/free-biweekly-timesheet-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import BiweeklyTimesheetInputs from "@/components/tools/inputs/BiweeklyTimesheetInputs";

export const metadata: Metadata = {
  title: freeBiweeklyTimesheetCalculatorData.seo.title,
  description: freeBiweeklyTimesheetCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${freeBiweeklyTimesheetCalculatorData.slug}`,
  },
  openGraph: {
    title: freeBiweeklyTimesheetCalculatorData.seo.title,
    description: freeBiweeklyTimesheetCalculatorData.seo.metaDescription,
    url: `/tools/${freeBiweeklyTimesheetCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Biweekly Timesheet Calculator",
  url: "https://thegodoftime.com/tools/free-biweekly-timesheet-calculator",
  description:
    "Free biweekly timesheet calculator with overtime support. Track 14-day work hours, deduct breaks, and generate payroll subtotals for each week.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "14-day biweekly timesheet with daily entry",
    "FLSA-compliant weekly overtime calculation",
    "Break deduction per shift",
    "Week 1 and Week 2 subtotals",
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
        data={freeBiweeklyTimesheetCalculatorData}
        InputsComponent={BiweeklyTimesheetInputs}
      />
    </>
  );
}
