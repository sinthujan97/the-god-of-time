import React from "react";
import { Metadata } from "next";
import { tenancyNoticeData } from "@/lib/tools/data/tenancy-notice";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import TenancyNoticeInputs from "@/components/tools/inputs/TenancyNoticeInputs";

export const metadata: Metadata = {
  title: tenancyNoticeData.seo.title,
  description: tenancyNoticeData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${tenancyNoticeData.slug}`,
  },
  openGraph: {
    title: tenancyNoticeData.seo.title,
    description: tenancyNoticeData.seo.metaDescription,
    url: `/tools/${tenancyNoticeData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={tenancyNoticeData}
      InputsComponent={TenancyNoticeInputs}
    />
  );
}
