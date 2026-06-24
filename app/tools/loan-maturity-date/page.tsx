import React from "react";
import { Metadata } from "next";
import { loanMaturityDateData } from "@/lib/tools/data/loan-maturity-date";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import LoanMaturityDateInputs from "@/components/tools/inputs/LoanMaturityDateInputs";

export const metadata: Metadata = {
  title: loanMaturityDateData.seo.title,
  description: loanMaturityDateData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${loanMaturityDateData.slug}`,
  },
  openGraph: {
    title: loanMaturityDateData.seo.title,
    description: loanMaturityDateData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${loanMaturityDateData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={loanMaturityDateData}
      InputsComponent={LoanMaturityDateInputs}
    />
  );
}
