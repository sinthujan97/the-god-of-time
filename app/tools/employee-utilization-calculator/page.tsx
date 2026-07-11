import React from "react";
import { Metadata } from "next";
import { employeeUtilizationCalculatorData } from "@/lib/tools/data/employee-utilization-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import EmployeeUtilizationInputs from "@/components/tools/inputs/EmployeeUtilizationInputs";

export const metadata: Metadata = {
  title: employeeUtilizationCalculatorData.seo.title,
  description: employeeUtilizationCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${employeeUtilizationCalculatorData.slug}`,
  },
  openGraph: {
    title: employeeUtilizationCalculatorData.seo.title,
    description: employeeUtilizationCalculatorData.seo.metaDescription,
    url: `/tools/${employeeUtilizationCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Employee Utilization Calculator",
  url: "https://thegodoftime.com/tools/employee-utilization-calculator",
  description:
    "Free employee utilization calculator. Calculate billable vs available hours ratio, utilization rate, and revenue efficiency for your team.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Individual and team utilization rate calculation",
    "Billable vs available hours tracking",
    "Revenue efficiency modeling",
    "Multi-employee dashboard",
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
        data={employeeUtilizationCalculatorData}
        InputsComponent={EmployeeUtilizationInputs}
      />
    </>
  );
}
