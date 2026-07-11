import React from "react";
import { Metadata } from "next";
import { freeLegalDeadlineCalculatorData } from "@/lib/tools/data/free-legal-deadline-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import CourtDeadlineCalculatorInputs from "@/components/tools/inputs/CourtDeadlineCalculatorInputs";

export const metadata: Metadata = {
  title: freeLegalDeadlineCalculatorData.seo.title,
  description: freeLegalDeadlineCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${freeLegalDeadlineCalculatorData.slug}`,
  },
  openGraph: {
    title: freeLegalDeadlineCalculatorData.seo.title,
    description: freeLegalDeadlineCalculatorData.seo.metaDescription,
    url: `/tools/${freeLegalDeadlineCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Legal Deadline Calculator",
  url: "https://thegodoftime.com/tools/free-legal-deadline-calculator",
  description:
    "Free legal deadline calculator. Calculate court filing deadlines in calendar or business days. Accounts for weekends and holidays.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Calendar, business, and court day deadline calculation",
    "Weekend and holiday adjustment",
    "State-specific holiday calendars",
    "Forward and backward date calculation",
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
        data={freeLegalDeadlineCalculatorData}
        InputsComponent={CourtDeadlineCalculatorInputs}
      />
    </>
  );
}
