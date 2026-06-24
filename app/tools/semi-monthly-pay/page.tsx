import React from "react";
import { Metadata } from "next";
import { semiMonthlyPayData } from "@/lib/tools/data/semi-monthly-pay";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import SemiMonthlyPayInputs from "@/components/tools/inputs/SemiMonthlyPayInputs";

export const metadata: Metadata = {
  title: semiMonthlyPayData.seo.title,
  description: semiMonthlyPayData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${semiMonthlyPayData.slug}`,
  },
  openGraph: {
    title: semiMonthlyPayData.seo.title,
    description: semiMonthlyPayData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${semiMonthlyPayData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={semiMonthlyPayData}
      InputsComponent={SemiMonthlyPayInputs}
    />
  );
}
