import React from "react";
import { Metadata } from "next";
import { crossBorderDeadlineCalculatorData } from "@/lib/tools/data/cross-border-deadline-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DeadlineMatcherInputs from "@/components/tools/inputs/DeadlineMatcherInputs";

export const metadata: Metadata = {
  title: crossBorderDeadlineCalculatorData.seo.title,
  description: crossBorderDeadlineCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${crossBorderDeadlineCalculatorData.slug}`,
  },
  openGraph: {
    title: crossBorderDeadlineCalculatorData.seo.title,
    description: crossBorderDeadlineCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${crossBorderDeadlineCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Cross-Border Deadline Calculator",
  url: "https://thegodoftime.com/tools/cross-border-deadline-calculator",
  description:
    "Free cross-border deadline calculator. Calculate court and legal filing deadlines across multiple jurisdictions with time zone and holiday support.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Multi-jurisdiction deadline mapping",
    "Time zone adjusted filing deadlines",
    "Day-shift detection across borders",
    "Printable deadline comparison matrix",
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
        data={crossBorderDeadlineCalculatorData}
        InputsComponent={DeadlineMatcherInputs}
      />
    </>
  );
}
