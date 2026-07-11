import React from "react";
import { Metadata } from "next";
import { perpetualCalendarData } from "@/lib/tools/data/perpetual-calendar";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import PerpetualCalendarInputs from "@/components/tools/inputs/PerpetualCalendarInputs";

export const metadata: Metadata = {
  title: perpetualCalendarData.seo.title,
  description: perpetualCalendarData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${perpetualCalendarData.slug}`,
  },
  openGraph: {
    title: perpetualCalendarData.seo.title,
    description: perpetualCalendarData.seo.metaDescription,
    url: `/tools/${perpetualCalendarData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={perpetualCalendarData}
      InputsComponent={PerpetualCalendarInputs}
    />
  );
}
