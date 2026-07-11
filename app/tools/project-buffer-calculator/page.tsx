import React from "react";
import { Metadata } from "next";
import { projectBufferCalculatorData } from "@/lib/tools/data/project-buffer-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import MilestoneBufferCalculatorInputs from "@/components/tools/inputs/MilestoneBufferCalculatorInputs";

export const metadata: Metadata = {
  title: projectBufferCalculatorData.seo.title,
  description: projectBufferCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${projectBufferCalculatorData.slug}`,
  },
  openGraph: {
    title: projectBufferCalculatorData.seo.title,
    description: projectBufferCalculatorData.seo.metaDescription,
    url: `/tools/${projectBufferCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Project Buffer Calculator",
  url: "https://thegodoftime.com/tools/project-buffer-calculator",
  description:
    "Free project buffer calculator. Calculate schedule buffer needed to protect your project deadline based on task risks and dependencies.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Schedule buffer calculation from task risk estimates",
    "Simple and Critical Chain buffer methods",
    "Buffered project deadline projection",
    "Buffer consumption tracking guidance",
  ],
};

export default function ToolPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <ToolPageTemplate
        data={projectBufferCalculatorData}
        InputsComponent={MilestoneBufferCalculatorInputs}
      />
    </>
  );
}
