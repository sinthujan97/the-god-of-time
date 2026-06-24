import React from "react";
import { Metadata } from "next";
import { fractionalExecutiveData } from "@/lib/tools/data/fractional-executive";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import FractionalExecutiveInputs from "@/components/tools/inputs/FractionalExecutiveInputs";

export const metadata: Metadata = {
  title: fractionalExecutiveData.seo.title,
  description: fractionalExecutiveData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${fractionalExecutiveData.slug}`,
  },
  openGraph: {
    title: fractionalExecutiveData.seo.title,
    description: fractionalExecutiveData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${fractionalExecutiveData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={fractionalExecutiveData}
      InputsComponent={FractionalExecutiveInputs}
    />
  );
}
