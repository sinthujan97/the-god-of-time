import React from "react";
import { Metadata } from "next";
import { remoteTeamOverlapData } from "@/lib/tools/data/remote-team-overlap";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import RemoteTeamOverlapInputs from "@/components/tools/inputs/RemoteTeamOverlapInputs";

export const metadata: Metadata = {
  title: remoteTeamOverlapData.seo.title,
  description: remoteTeamOverlapData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${remoteTeamOverlapData.slug}`,
  },
  openGraph: {
    title: remoteTeamOverlapData.seo.title,
    description: remoteTeamOverlapData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${remoteTeamOverlapData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={remoteTeamOverlapData}
      InputsComponent={RemoteTeamOverlapInputs}
    />
  );
}
