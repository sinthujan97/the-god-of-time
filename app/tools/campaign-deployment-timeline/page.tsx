import React from "react";
import { Metadata } from "next";
import { campaignDeploymentTimelineData } from "@/lib/tools/data/campaign-deployment-timeline";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import CampaignDeploymentTimelineInputs from "@/components/tools/inputs/CampaignDeploymentTimelineInputs";

export const metadata: Metadata = {
  title: campaignDeploymentTimelineData.seo.title,
  description: campaignDeploymentTimelineData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${campaignDeploymentTimelineData.slug}`,
  },
  openGraph: {
    title: campaignDeploymentTimelineData.seo.title,
    description: campaignDeploymentTimelineData.seo.metaDescription,
    url: `/tools/${campaignDeploymentTimelineData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={campaignDeploymentTimelineData}
      InputsComponent={CampaignDeploymentTimelineInputs}
    />
  );
}
