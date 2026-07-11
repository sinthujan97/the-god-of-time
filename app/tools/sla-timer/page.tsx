import React from "react";
import { Metadata } from "next";
import { slaTimerData } from "@/lib/tools/data/sla-timer";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import SlaCountdownTimerInputs from "@/components/tools/inputs/SlaCountdownTimerInputs";

export const metadata: Metadata = {
  title: slaTimerData.seo.title,
  description: slaTimerData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${slaTimerData.slug}`,
  },
  openGraph: {
    title: slaTimerData.seo.title,
    description: slaTimerData.seo.metaDescription,
    url: `/tools/${slaTimerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SLA Timer",
  url: "https://thegodoftime.com/tools/sla-timer",
  description:
    "Free SLA timer with countdown and breach alerts. Track service level agreement deadlines in real time.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time SLA breach countdown",
    "Configurable alert thresholds",
    "Business hours and holiday exclusion support",
    "Visual and sound breach alerts",
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
        data={slaTimerData}
        InputsComponent={SlaCountdownTimerInputs}
      />
    </>
  );
}
