import React from "react";
import { Metadata } from "next";
import { grossToNetPayData } from "@/lib/tools/data/gross-to-net-pay";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import GrossToNetPayInputs from "@/components/tools/inputs/GrossToNetPayInputs";

export const metadata: Metadata = {
  title: grossToNetPayData.seo.title,
  description: grossToNetPayData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${grossToNetPayData.slug}`,
  },
  openGraph: {
    title: grossToNetPayData.seo.title,
    description: grossToNetPayData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${grossToNetPayData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={grossToNetPayData}
      InputsComponent={GrossToNetPayInputs}
    />
  );
}
