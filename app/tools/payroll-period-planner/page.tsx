import React from "react";
import { Metadata } from "next";
import { payrollPeriodPlannerData } from "@/lib/tools/data/payroll-period-planner";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import PayrollPeriodPlannerInputs from "@/components/tools/inputs/PayrollPeriodPlannerInputs";

export const metadata: Metadata = {
  title: payrollPeriodPlannerData.seo.title,
  description: payrollPeriodPlannerData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${payrollPeriodPlannerData.slug}`,
  },
  openGraph: {
    title: payrollPeriodPlannerData.seo.title,
    description: payrollPeriodPlannerData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${payrollPeriodPlannerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={payrollPeriodPlannerData}
      InputsComponent={PayrollPeriodPlannerInputs}
    />
  );
}
