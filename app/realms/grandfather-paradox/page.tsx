import Link from "next/link";
import GrandfatherParadox from "@/components/realms/experiences/GrandfatherParadox";

export const metadata = {
  title: "Grandfather Paradox | Interactive Time Travel Sim",
  description:
    "Explore the grandfather paradox interactively. Simulate time travel decisions and see how causal loops resolve. Explained simply. No signup needed.",
  keywords: [
    "grandfather paradox",
    "grandfather paradox explained",
    "time travel paradox",
    "causal loop",
    "TVA",
    "temporal mechanics",
  ],
  openGraph: {
    title: "Grandfather Paradox | The God of Time",
    description:
      "Submit your time travel plan to the TVA. Receive an official case file: classified, risk assessed, and formally stamped.",
    url: "/realms/grandfather-paradox",
  },
  alternates: {
    canonical: "/realms/grandfather-paradox",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Grandfather Paradox Simulator",
  url: "https://thegodoftime.com/realms/grandfather-paradox",
  description:
    "Explore the grandfather paradox interactively. Simulate time travel decisions and see how causal loops resolve.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function GrandfatherParadoxPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <GrandfatherParadox />
      <div className="realm-page">
        <div className="realm-two-col-zone" style={{ paddingTop: 0 }}>
          <div className="realm-main-col" style={{ paddingTop: 0, borderRight: "none" }}>
            <p className="seo-body seo-internal-links mt-0 mb-12 text-base font-sans font-light text-text-primary leading-relaxed border-t border-border-subtle pt-6">
              For related tools, check out{" "}
              <Link href="/realms/the-sacred-timeline" className="seo-internal-link transition-all" style={{ color: "#00B4D8" }}>
                The Sacred Timeline
              </Link>{" "}
              to explore the Marvel TVA and sacred timeline concept, the{" "}
              <Link href="/realms/butterfly-effect" className="seo-internal-link transition-all" style={{ color: "#00B4D8" }}>
                Butterfly Effect
              </Link>{" "}
              to simulate how small actions create cascading changes, and{" "}
              <Link href="/realms/fifth-dimension" className="seo-internal-link transition-all" style={{ color: "#00B4D8" }}>
                The 5th Dimension
              </Link>{" "}
              to explore alternate timeline life events.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
