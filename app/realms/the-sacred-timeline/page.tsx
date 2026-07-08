import Link from "next/link";
import SacredTimelineAudit from "@/components/realms/experiences/SacredTimelineAudit";

export const metadata = {
  title: "The Sacred Timeline | TVA Compliance Simulator",
  description:
    "Explore the sacred timeline from Marvel's Loki. Check your life for nexus events. Interactive TVA compliance audit. No signup required.",
  keywords: ["sacred timeline", "TVA", "Loki", "time variance authority", "minority report", "pre-crime", "nexus event", "earth 616"],
  openGraph: {
    title: "The Sacred Timeline | The God of Time",
    description: "Submit your life data to the TVA. Receive your official compliance score, unauthorized variants list, and pre-crime arrest date.",
    url: "https://thegodoftime.com/realms/the-sacred-timeline",
  },
  alternates: { canonical: "https://thegodoftime.com/realms/the-sacred-timeline" },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "The Sacred Timeline",
  url: "https://thegodoftime.com/realms/the-sacred-timeline",
  description:
    "Explore the sacred timeline from Marvel's Loki. Check your life for nexus events with an interactive TVA compliance audit.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function TheSacredTimelinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <SacredTimelineAudit />
      <div className="realm-page">
        <div className="realm-two-col-zone" style={{ paddingTop: 0 }}>
          <div className="realm-main-col" style={{ paddingTop: 0, borderRight: "none" }}>
            <p className="seo-body seo-internal-links mt-0 mb-12 text-base font-sans font-light text-text-primary leading-relaxed border-t border-border-subtle pt-6">
              For related tools, check out the{" "}
              <Link href="/realms/grandfather-paradox" className="seo-internal-link transition-all" style={{ color: "#7C3AED" }}>
                Grandfather Paradox
              </Link>{" "}
              to explore the time travel paradox the TVA prevents, the{" "}
              <Link href="/realms/butterfly-effect" className="seo-internal-link transition-all" style={{ color: "#7C3AED" }}>
                Butterfly Effect
              </Link>{" "}
              to see how nexus events create cascading changes, and the{" "}
              <Link href="/realms/fictional-futures" className="seo-internal-link transition-all" style={{ color: "#7C3AED" }}>
                Fictional Futures Countdown
              </Link>{" "}
              to count down to sci-fi futures from Marvel and beyond.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
