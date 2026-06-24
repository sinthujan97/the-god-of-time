import React from "react";
import { Metadata } from "next";
import { shiftDifferentialPayData } from "@/lib/tools/data/shift-differential-pay";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ShiftDifferentialInputs from "@/components/tools/inputs/ShiftDifferentialInputs";

export const metadata: Metadata = {
  title: shiftDifferentialPayData.seo.title,
  description: shiftDifferentialPayData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${shiftDifferentialPayData.slug}`,
  },
  openGraph: {
    title: shiftDifferentialPayData.seo.title,
    description: shiftDifferentialPayData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${shiftDifferentialPayData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={shiftDifferentialPayData}
      InputsComponent={ShiftDifferentialInputs}
    />
  );
}
