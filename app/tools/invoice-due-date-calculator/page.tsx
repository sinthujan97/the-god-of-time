import React from "react";
import { Metadata } from "next";
import { invoiceDueDateCalculatorData } from "@/lib/tools/data/invoice-due-date-calculator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import InvoiceDueDateCalculatorInputs from "@/components/tools/inputs/InvoiceDueDateCalculatorInputs";

export const metadata: Metadata = {
  title: invoiceDueDateCalculatorData.seo.title,
  description: invoiceDueDateCalculatorData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${invoiceDueDateCalculatorData.slug}`,
  },
  openGraph: {
    title: invoiceDueDateCalculatorData.seo.title,
    description: invoiceDueDateCalculatorData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${invoiceDueDateCalculatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={invoiceDueDateCalculatorData}
      InputsComponent={InvoiceDueDateCalculatorInputs}
    />
  );
}
