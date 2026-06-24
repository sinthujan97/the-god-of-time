import React from "react";
import { Metadata } from "next";
import { timeCardWithBreaksData } from "@/lib/tools/data/time-card-with-breaks";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import TimeCardWithBreaksInputs from "@/components/tools/inputs/TimeCardWithBreaksInputs";

export const metadata: Metadata = {
  title: timeCardWithBreaksData.seo.title,
  description: timeCardWithBreaksData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${timeCardWithBreaksData.slug}`,
  },
  openGraph: {
    title: timeCardWithBreaksData.seo.title,
    description: timeCardWithBreaksData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${timeCardWithBreaksData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={timeCardWithBreaksData}
      InputsComponent={TimeCardWithBreaksInputs}
    />
  );
}
