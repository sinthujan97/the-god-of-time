import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { pregnancyDueDateData } from "@/lib/tools/data/pregnancy-due-date";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import PregnancyDueInputs from "@/components/tools/inputs/PregnancyDueInputs";
import { SITE_URL } from "@/lib/constants";

const CONTENT_REVIEWED_DATE = "2026-07-14";

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
  url: `${SITE_URL}/tools/${pregnancyDueDateData.slug}`,
  description: pregnancyDueDateData.description,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  dateModified: CONTENT_REVIEWED_DATE,
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
        <div className="w-full lg:w-[720px] pb-8 text-sm font-sans font-light text-text-primary space-y-3">
          <p className="text-text-muted">
            This calculator&rsquo;s method (Naegele&rsquo;s Rule, 280 days from your last menstrual period) is the same standard dating method used by the{" "}
            <a
              href="https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-all"
              style={{ color: pregnancyDueDateData.groupAccent }}
            >
              American College of Obstetricians and Gynecologists (ACOG)
            </a>{" "}
            and the{" "}
            <a
              href="https://www.nhs.uk/pregnancy/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-all"
              style={{ color: pregnancyDueDateData.groupAccent }}
            >
              NHS
            </a>
            . It&rsquo;s an estimate, not a diagnosis — always confirm your due date with your own healthcare provider, who may adjust it after an early ultrasound.
            <span className="block mt-1 font-mono text-xs text-text-faint">Content last reviewed {CONTENT_REVIEWED_DATE}</span>
          </p>
          <Link
            href="/clocks/countdown-timer-online"
            className="inline-block transition-all"
            style={{ color: pregnancyDueDateData.groupAccent }}
          >
            Count down to your due date
          </Link>
        </div>
      </div>
    </>
  );
}
