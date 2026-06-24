import React from "react";
import { Metadata } from "next";
import { timeDurationCalculatorData } from "@/lib/tools/data/time-duration-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import TimeDurationInputs from "@/components/tools/inputs/TimeDurationInputs";

export const metadata: Metadata = {
  title: timeDurationCalculatorData.seo.title,
  description: timeDurationCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${timeDurationCalculatorData.slug}`,
  },
  openGraph: {
    title: timeDurationCalculatorData.seo.title,
    description: timeDurationCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${timeDurationCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={timeDurationCalculatorData}
      InputsComponent={TimeDurationInputs}
    />
  );
}
