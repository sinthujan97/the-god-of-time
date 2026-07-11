import React from "react";
import { Metadata } from "next";
import { retainerHoursTrackerOnlineData } from "@/lib/tools/data/retainer-hours-tracker-online";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import RetainerBurndownInputs from "@/components/tools/inputs/RetainerBurndownInputs";

export const metadata: Metadata = {
  title: retainerHoursTrackerOnlineData.seo.title,
  description: retainerHoursTrackerOnlineData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${retainerHoursTrackerOnlineData.slug}`,
  },
  openGraph: {
    title: retainerHoursTrackerOnlineData.seo.title,
    description: retainerHoursTrackerOnlineData.seo.metaDescription,
    url: `/tools/${retainerHoursTrackerOnlineData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Retainer Hours Tracker Online",
  url: "https://thegodoftime.com/tools/retainer-hours-tracker-online",
  description:
    "Free retainer hours tracker online. Monitor retainer hours consumed, remaining balance, burn rate, and projected depletion dates for monthly client retainers.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Retainer hours consumed vs. remaining tracking",
    "Daily burn rate calculation",
    "Projected depletion date",
    "Hours per day needed to pace correctly",
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
        data={retainerHoursTrackerOnlineData}
        InputsComponent={RetainerBurndownInputs}
      />
    </>
  );
}
