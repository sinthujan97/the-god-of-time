import React from "react";
import { Metadata } from "next";
import { multiJobIncomeSyncData } from "@/lib/tools/data/multi-job-income-sync";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import MultiJobIncomeInputs from "@/components/tools/inputs/MultiJobIncomeInputs";

export const metadata: Metadata = {
  title: multiJobIncomeSyncData.seo.title,
  description: multiJobIncomeSyncData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${multiJobIncomeSyncData.slug}`,
  },
  openGraph: {
    title: multiJobIncomeSyncData.seo.title,
    description: multiJobIncomeSyncData.seo.metaDescription,
    url: `/tools/${multiJobIncomeSyncData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={multiJobIncomeSyncData}
      InputsComponent={MultiJobIncomeInputs}
    />
  );
}
