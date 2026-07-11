import React from "react";
import { Metadata } from "next";
import { rruleGeneratorOnlineData } from "@/lib/tools/data/rrule-generator-online";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import RecurringEventRruleInputs from "@/components/tools/inputs/RecurringEventRruleInputs";

export const metadata: Metadata = {
  title: rruleGeneratorOnlineData.seo.title,
  description: rruleGeneratorOnlineData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${rruleGeneratorOnlineData.slug}`,
  },
  openGraph: {
    title: rruleGeneratorOnlineData.seo.title,
    description: rruleGeneratorOnlineData.seo.metaDescription,
    url: `/tools/${rruleGeneratorOnlineData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "RRule Generator Online",
  url: "https://thegodoftime.com/tools/rrule-generator-online",
  description:
    "Free RRule generator. Create iCal RRULE strings for recurring events. Supports daily, weekly, monthly, yearly recurrence with exceptions.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "RFC 5545 compliant RRULE string generation",
    "Daily, weekly, monthly, and yearly recurrence",
    "Occurrence preview",
    ".ics file export",
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
        data={rruleGeneratorOnlineData}
        InputsComponent={RecurringEventRruleInputs}
      />
    </>
  );
}
