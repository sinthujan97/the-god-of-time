import React from "react";
import { Metadata } from "next";
import { semiMonthlyPayCalculatorData } from "@/lib/tools/data/semi-monthly-pay-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import SemiMonthlyPayInputs from "@/components/tools/inputs/SemiMonthlyPayInputs";

export const metadata: Metadata = {
  title: semiMonthlyPayCalculatorData.seo.title,
  description: semiMonthlyPayCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${semiMonthlyPayCalculatorData.slug}`,
  },
  openGraph: {
    title: semiMonthlyPayCalculatorData.seo.title,
    description: semiMonthlyPayCalculatorData.seo.metaDescription,
    url: `/tools/${semiMonthlyPayCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Semi Monthly Pay Calculator",
  url: "https://thegodoftime.com/tools/semi-monthly-pay-calculator",
  description:
    "Free semi monthly pay calculator. Convert annual salary to semi monthly paychecks instantly. See gross pay for 1st and 15th pay dates.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Annual salary to semi-monthly paycheck conversion",
    "Upcoming paydate schedule generator",
    "Weekend adjustment detection",
    "Hourly rate to semi-monthly pay conversion",
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
        data={semiMonthlyPayCalculatorData}
        InputsComponent={SemiMonthlyPayInputs}
      />
    </>
  );
}
