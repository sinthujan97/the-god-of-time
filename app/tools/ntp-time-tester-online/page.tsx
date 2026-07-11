import React from "react";
import { Metadata } from "next";
import { ntpTimeTesterOnlineData } from "@/lib/tools/data/ntp-time-tester-online";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import NTPLatencyInputs from "@/components/tools/inputs/NTPLatencyInputs";

export const metadata: Metadata = {
  title: ntpTimeTesterOnlineData.seo.title,
  description: ntpTimeTesterOnlineData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${ntpTimeTesterOnlineData.slug}`,
  },
  openGraph: {
    title: ntpTimeTesterOnlineData.seo.title,
    description: ntpTimeTesterOnlineData.seo.metaDescription,
    url: `/tools/${ntpTimeTesterOnlineData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NTP Time Tester Online",
  url: "https://thegodoftime.com/tools/ntp-time-tester-online",
  description:
    "Free NTP time tester. Check NTP server accuracy, measure time offset, and compare your system clock against network time.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "NTP server offset measurement",
    "Round-trip delay (RTT) calculation",
    "Synchronization status diagnostics",
    "Multi-server comparison support",
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
        data={ntpTimeTesterOnlineData}
        InputsComponent={NTPLatencyInputs}
      />
    </>
  );
}
