import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { pregnancyDueDateData } from "@/lib/tools/data/pregnancy-due-date";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import PregnancyDueInputs from "@/components/tools/inputs/PregnancyDueInputs";

export const metadata: Metadata = {
  title: pregnancyDueDateData.seo.title,
  description: pregnancyDueDateData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${pregnancyDueDateData.slug}`,
  },
  openGraph: {
    title: pregnancyDueDateData.seo.title,
    description: pregnancyDueDateData.seo.metaDescription,
    url: `/tools/${pregnancyDueDateData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pregnancy Due Date Calculator",
  url: `https://thegodoftime.com/tools/${pregnancyDueDateData.slug}`,
  description: pregnancyDueDateData.description,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function ToolPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <ToolPageTemplate
        data={pregnancyDueDateData}
        InputsComponent={PregnancyDueInputs}
      />
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="w-full lg:w-[720px] pb-8 text-sm font-sans font-light text-text-primary">
          <Link
            href="/clocks/countdown-timer-online"
            className="transition-all"
            style={{ color: pregnancyDueDateData.groupAccent }}
          >
            Count down to your due date
          </Link>
        </div>
      </div>
    </>
  );
}
