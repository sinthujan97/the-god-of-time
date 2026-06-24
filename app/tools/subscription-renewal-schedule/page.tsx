import React from "react";
import { Metadata } from "next";
import { subscriptionRenewalScheduleData } from "@/lib/tools/data/subscription-renewal-schedule";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import SubscriptionRenewalScheduleInputs from "@/components/tools/inputs/SubscriptionRenewalScheduleInputs";

export const metadata: Metadata = {
  title: subscriptionRenewalScheduleData.seo.title,
  description: subscriptionRenewalScheduleData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${subscriptionRenewalScheduleData.slug}`,
  },
  openGraph: {
    title: subscriptionRenewalScheduleData.seo.title,
    description: subscriptionRenewalScheduleData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${subscriptionRenewalScheduleData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={subscriptionRenewalScheduleData}
      InputsComponent={SubscriptionRenewalScheduleInputs}
    />
  );
}
