import React from "react";
import { Metadata } from "next";
import { agileSprintDateCalculatorData } from "@/lib/tools/data/agile-sprint-date-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import SprintDateCalculatorInputs from "@/components/tools/inputs/SprintDateCalculatorInputs";

export const metadata: Metadata = {
  title: agileSprintDateCalculatorData.seo.title,
  description: agileSprintDateCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${agileSprintDateCalculatorData.slug}`,
  },
  openGraph: {
    title: agileSprintDateCalculatorData.seo.title,
    description: agileSprintDateCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${agileSprintDateCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Agile Sprint Date Calculator",
  url: "https://thegodoftime.com/tools/agile-sprint-date-calculator",
  description:
    "Free agile sprint date calculator. Plan sprint start and end dates, ceremonies, and milestones for any sprint length.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Multi-sprint calendar generation",
    "Sprint ceremony date mapping",
    "Custom sprint length support (1-4 weeks)",
    "Next sprint start date calculation",
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
        data={agileSprintDateCalculatorData}
        InputsComponent={SprintDateCalculatorInputs}
      />
    </>
  );
}
