import React from "react";
import { Metadata } from "next";
import { flightDurationCalculatorData } from "@/lib/tools/data/flight-duration-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import FlightDurationInputs from "@/components/tools/inputs/FlightDurationInputs";

export const metadata: Metadata = {
  title: flightDurationCalculatorData.seo.title,
  description: flightDurationCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${flightDurationCalculatorData.slug}`,
  },
  openGraph: {
    title: flightDurationCalculatorData.seo.title,
    description: flightDurationCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${flightDurationCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={flightDurationCalculatorData}
      InputsComponent={FlightDurationInputs}
    />
  );
}
