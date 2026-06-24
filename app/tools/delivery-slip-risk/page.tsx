import React from "react";
import { Metadata } from "next";
import { deliverySlipRiskData } from "@/lib/tools/data/delivery-slip-risk";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DeliverySlipRiskInputs from "@/components/tools/inputs/DeliverySlipRiskInputs";

export const metadata: Metadata = {
  title: deliverySlipRiskData.seo.title,
  description: deliverySlipRiskData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${deliverySlipRiskData.slug}`,
  },
  openGraph: {
    title: deliverySlipRiskData.seo.title,
    description: deliverySlipRiskData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${deliverySlipRiskData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={deliverySlipRiskData}
      InputsComponent={DeliverySlipRiskInputs}
    />
  );
}
