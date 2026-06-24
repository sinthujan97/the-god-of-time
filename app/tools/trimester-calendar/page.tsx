import React from "react";
import { Metadata } from "next";
import { trimesterCalendarData } from "@/lib/tools/data/trimester-calendar";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import TrimesterCalendarInputs from "@/components/tools/inputs/TrimesterCalendarInputs";

export const metadata: Metadata = {
  title: trimesterCalendarData.seo.title,
  description: trimesterCalendarData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${trimesterCalendarData.slug}`,
  },
  openGraph: {
    title: trimesterCalendarData.seo.title,
    description: trimesterCalendarData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${trimesterCalendarData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={trimesterCalendarData}
      InputsComponent={TrimesterCalendarInputs}
    />
  );
}
