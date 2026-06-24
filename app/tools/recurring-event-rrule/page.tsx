import React from "react";
import { Metadata } from "next";
import { recurringEventRruleData } from "@/lib/tools/data/recurring-event-rrule";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import RecurringEventRruleInputs from "@/components/tools/inputs/RecurringEventRruleInputs";

export const metadata: Metadata = {
  title: recurringEventRruleData.seo.title,
  description: recurringEventRruleData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${recurringEventRruleData.slug}`,
  },
  openGraph: {
    title: recurringEventRruleData.seo.title,
    description: recurringEventRruleData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${recurringEventRruleData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={recurringEventRruleData}
      InputsComponent={RecurringEventRruleInputs}
    />
  );
}
