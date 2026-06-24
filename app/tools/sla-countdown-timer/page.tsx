import React from "react";
import { Metadata } from "next";
import { slaCountdownTimerData } from "@/lib/tools/data/sla-countdown-timer";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import SlaCountdownTimerInputs from "@/components/tools/inputs/SlaCountdownTimerInputs";

export const metadata: Metadata = {
  title: slaCountdownTimerData.seo.title,
  description: slaCountdownTimerData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${slaCountdownTimerData.slug}`,
  },
  openGraph: {
    title: slaCountdownTimerData.seo.title,
    description: slaCountdownTimerData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${slaCountdownTimerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={slaCountdownTimerData}
      InputsComponent={SlaCountdownTimerInputs}
    />
  );
}
