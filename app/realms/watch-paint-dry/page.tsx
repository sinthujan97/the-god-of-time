import Link from "next/link";
import PaintDrySimulator from "@/components/realms/experiences/PaintDrySimulator";

export const metadata = {
  title: "Watch Paint Dry | Scientifically Accurate Simulator",
  description:
    "Watch paint dry online. A scientifically accurate simulator tracking real polymer cross-linking stages. Oddly satisfying and surprisingly informative.",
  keywords: [
    "watch paint dry",
    "watch paint dry online",
    "watch paint dry simulator",
    "paint drying time",
    "absurd clock",
  ],
  openGraph: {
    title: "Watch Paint Dry | The God of Time",
    description:
      "Watch paint dry online. Scientifically accurate polymer cross-linking stages. More interesting than it sounds.",
    url: "https://thegodoftime.com/realms/watch-paint-dry",
  },
  alternates: {
    canonical: "https://thegodoftime.com/realms/watch-paint-dry",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Watch Paint Dry Simulator",
  url: "https://thegodoftime.com/realms/watch-paint-dry",
  description:
    "A scientifically accurate paint-drying simulator tracking real polymer cross-linking stages, from surface evaporation to full cure.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function WatchPaintDryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <PaintDrySimulator />
      <div className="realm-page">
        <div className="realm-two-col-zone" style={{ paddingTop: 0 }}>
          <div className="realm-main-col" style={{ paddingTop: 0, borderRight: "none" }}>
            <p className="seo-body seo-internal-links mt-0 mb-12 text-base font-sans font-light text-text-primary leading-relaxed border-t border-border-subtle pt-6">
              For related tools, check out the{" "}
              <Link href="/realms/boredom-physics" className="seo-internal-link transition-all" style={{ color: "#E09A3A" }}>
                Boredom Physics Suite
              </Link>{" "}
              to calculate time dilation during boring events, the{" "}
              <Link href="/realms/absurd-clocks" className="seo-internal-link transition-all" style={{ color: "#E09A3A" }}>
                Absurd Clocks
              </Link>{" "}
              collection for more oddly satisfying time measurements, and the{" "}
              <Link href="/clocks/countdown-timer-online" className="seo-internal-link transition-all" style={{ color: "#E09A3A" }}>
                Countdown Timer
              </Link>{" "}
              to use while waiting for real paint to dry.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
