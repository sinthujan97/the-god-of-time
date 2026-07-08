import React from "react";
import { Metadata } from "next";
import { fractionalWorkHoursAllocatorData } from "@/lib/tools/data/fractional-work-hours-allocator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import FractionalExecutiveInputs from "@/components/tools/inputs/FractionalExecutiveInputs";

export const metadata: Metadata = {
  title: fractionalWorkHoursAllocatorData.seo.title,
  description: fractionalWorkHoursAllocatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${fractionalWorkHoursAllocatorData.slug}`,
  },
  openGraph: {
    title: fractionalWorkHoursAllocatorData.seo.title,
    description: fractionalWorkHoursAllocatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${fractionalWorkHoursAllocatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fractional Work Hours Allocator",
  url: "https://thegodoftime.com/tools/fractional-work-hours-allocator",
  description:
    "Free fractional work hours allocator. Plan client hours, track capacity utilization, and model monthly revenues across multiple fractional or consulting engagements.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Multi-client hours allocation",
    "Capacity utilization rate tracking",
    "Weekly and monthly revenue modeling",
    "Remaining capacity calculator",
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
        data={fractionalWorkHoursAllocatorData}
        InputsComponent={FractionalExecutiveInputs}
      />
    </>
  );
}
