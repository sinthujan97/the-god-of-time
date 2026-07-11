import React from "react";
import { Metadata } from "next";
import { eventCountdownBackTimerData } from "@/lib/tools/data/event-countdown-back-timer";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import EventCountdownBackTimerInputs from "@/components/tools/inputs/EventCountdownBackTimerInputs";

export const metadata: Metadata = {
  title: eventCountdownBackTimerData.seo.title,
  description: eventCountdownBackTimerData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${eventCountdownBackTimerData.slug}`,
  },
  openGraph: {
    title: eventCountdownBackTimerData.seo.title,
    description: eventCountdownBackTimerData.seo.metaDescription,
    url: `/tools/${eventCountdownBackTimerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={eventCountdownBackTimerData}
      InputsComponent={EventCountdownBackTimerInputs}
    />
  );
}
