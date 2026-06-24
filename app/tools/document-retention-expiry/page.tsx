import React from "react";
import { Metadata } from "next";
import { documentRetentionExpiryData } from "@/lib/tools/data/document-retention-expiry";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DocumentRetentionExpiryInputs from "@/components/tools/inputs/DocumentRetentionExpiryInputs";

export const metadata: Metadata = {
  title: documentRetentionExpiryData.seo.title,
  description: documentRetentionExpiryData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${documentRetentionExpiryData.slug}`,
  },
  openGraph: {
    title: documentRetentionExpiryData.seo.title,
    description: documentRetentionExpiryData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${documentRetentionExpiryData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={documentRetentionExpiryData}
      InputsComponent={DocumentRetentionExpiryInputs}
    />
  );
}
