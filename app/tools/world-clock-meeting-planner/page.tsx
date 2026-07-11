import React from "react";
import { Metadata } from "next";
import { worldClockMeetingPlannerData } from "@/lib/tools/data/world-clock-meeting-planner";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import MeetingPlannerSweetSpotInputs from "@/components/tools/inputs/MeetingPlannerSweetSpotInputs";

export const metadata: Metadata = {
  title: worldClockMeetingPlannerData.seo.title,
  description: worldClockMeetingPlannerData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${worldClockMeetingPlannerData.slug}`,
  },
  openGraph: {
    title: worldClockMeetingPlannerData.seo.title,
    description: worldClockMeetingPlannerData.seo.metaDescription,
    url: `/tools/${worldClockMeetingPlannerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "World Clock Meeting Planner",
  url: "https://thegodoftime.com/tools/world-clock-meeting-planner",
  description:
    "Free world clock meeting planner. Find the best meeting time for teams in different time zones. Visual overlap grid.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Multi-city working hours overlap grid",
    "Customizable working hours per participant",
    "Daylight saving time adjustment",
    "Calendar export for scheduled meetings",
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
        data={worldClockMeetingPlannerData}
        InputsComponent={MeetingPlannerSweetSpotInputs}
      />
    </>
  );
}
