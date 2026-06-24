import React from "react";
import { Metadata } from "next";
import { meetingPlannerData } from "@/lib/tools/data/meeting-planner";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import MeetingPlannerSweetSpotInputs from "@/components/tools/inputs/MeetingPlannerSweetSpotInputs";

export const metadata: Metadata = {
  title: meetingPlannerData.seo.title,
  description: meetingPlannerData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${meetingPlannerData.slug}`,
  },
  openGraph: {
    title: meetingPlannerData.seo.title,
    description: meetingPlannerData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${meetingPlannerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={meetingPlannerData}
      InputsComponent={MeetingPlannerSweetSpotInputs}
    />
  );
}
