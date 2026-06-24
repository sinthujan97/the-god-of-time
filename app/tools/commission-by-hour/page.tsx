import React from "react";
import { Metadata } from "next";
import { commissionByHourData } from "@/lib/tools/data/commission-by-hour";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import CommissionByHourInputs from "@/components/tools/inputs/CommissionByHourInputs";

export const metadata: Metadata = {
  title: commissionByHourData.seo.title,
  description: commissionByHourData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${commissionByHourData.slug}`,
  },
  openGraph: {
    title: commissionByHourData.seo.title,
    description: commissionByHourData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${commissionByHourData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={commissionByHourData}
      InputsComponent={CommissionByHourInputs}
    />
  );
}
