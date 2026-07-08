import Link from "next/link";
import ParentChildTime from "@/components/realms/experiences/ParentChildTime";

export const metadata = {
  title: "Parent Child Time Calculator | Time Left Together",
  description:
    "Free parent child time calculator. See how much time you have left with your parents before they are gone. Based on the sobering 90% statistic. No signup required.",
  keywords: [
    "parent child time calculator",
    "time left with parents",
    "how much time do i have left with my parents",
    "parent time remaining",
    "family time calculator",
  ],
  openGraph: {
    title: "Parent Child Time Calculator | The God of Time",
    description:
      "By the time a child turns 18, parents have already spent approximately 90% of the total time they will ever spend with that child. See what's left.",
    url: "https://thegodoftime.com/realms/parent-child-time-calculator",
  },
  alternates: { canonical: "https://thegodoftime.com/realms/parent-child-time-calculator" },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Parent Child Time Calculator",
  url: "https://thegodoftime.com/realms/parent-child-time-calculator",
  description:
    "Free parent child time calculator. See how much time you have left with your parents before they are gone, based on current ages and visit frequency.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function ParentChildTimeCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <ParentChildTime />
      <div className="realm-page">
        <div className="realm-two-col-zone" style={{ paddingTop: 0 }}>
          <div className="realm-main-col" style={{ paddingTop: 0, borderRight: "none" }}>
            <p className="seo-body seo-internal-links mt-0 mb-12 text-base font-sans font-light text-text-primary leading-relaxed border-t border-border-subtle pt-6">
              For related tools, check out the{" "}
              <Link href="/realms/remaining-experiences" className="seo-internal-link transition-all" style={{ color: "#FB7185" }}>
                Remaining Experiences Counter
              </Link>{" "}
              to count remaining summers, sunsets, and experiences, the{" "}
              <Link href="/tools/age-calculator" className="seo-internal-link transition-all" style={{ color: "#FB7185" }}>
                Age Calculator
              </Link>{" "}
              to calculate exact age in years, months, and days, and the{" "}
              <Link href="/realms/legacy-memory-calculator" className="seo-internal-link transition-all" style={{ color: "#FB7185" }}>
                Legacy Memory Calculator
              </Link>{" "}
              to see how long your memory will be preserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
