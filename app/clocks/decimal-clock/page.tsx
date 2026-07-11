import type { Metadata } from "next";
import DecimalClock from "@/components/clocks/experiences/DecimalClock";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Decimal Clock | French Revolutionary Time Online",
  description:
    "Free decimal clock showing French Revolutionary decimal time. 10 decimal hours, 100 decimal minutes per hour. Live display. No signup needed.",
  alternates: {
    canonical: "/clocks/decimal-clock",
  },
  openGraph: {
    title: "Decimal Clock | French Revolutionary Time Online",
    description:
      "Free decimal clock showing French Revolutionary decimal time. 10 decimal hours, 100 decimal minutes per hour.",
    url: "/clocks/decimal-clock",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Decimal Clock",
  url: "https://thegodoftime.com/clocks/decimal-clock",
  description:
    "Free decimal clock showing French Revolutionary decimal time — 10 decimal hours, 100 decimal minutes, 100 decimal seconds per day.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Live French Revolutionary decimal time display",
    "Standard time reference readout",
    "10-hour, 100-minute, 100-second day division",
    "Fullscreen mode",
  ],
};

const introText =
  "This decimal clock displays French Revolutionary decimal time — not a decimal-hours payroll calculator, but the historical alternative timekeeping system that divides the day into 10 decimal hours, each hour into 100 decimal minutes, and each minute into 100 decimal seconds. History enthusiasts, mathematics fans, and anyone curious about alternative timekeeping systems use this live decimal time display to see exactly how the French Revolutionary calendar reformers proposed replacing the clock entirely, right alongside the standard time reference so the two stay easy to compare.";

const sections = [
  {
    title: "What Is Decimal Time?",
    body:
      "Decimal time was introduced during the French Revolution in 1793 as part of the same metric push that gave the world the meter, liter, and kilogram — applied this time to the clock itself. Under the system, 1 decimal day equals 10 decimal hours, 1 decimal hour equals 100 decimal minutes, and 1 decimal minute equals 100 decimal seconds, for a total of exactly 100,000 decimal seconds per day compared to 86,400 regular seconds. It was adopted briefly but abandoned by 1795 as simply too impractical to coexist with existing clocks and habits. One decimal hour works out to 2.4 regular hours, and conveniently, half the decimal day — 5:00 decimal — lands exactly on noon. The concept never fully died, though: Swatch Internet Time (measured in .beats) is essentially a modern revival of the same decimal-time idea, just rebranded for the internet era."
  },
  {
    title: "Why the Metric System Succeeded But Decimal Time Didn't",
    body:
      "The metric system succeeded broadly because base-10 units are simply intuitive for measuring physical quantities like length and mass. Decimal time failed for a very different reason: clocks and social schedules were already deeply embedded in daily life, and swapping the underlying unit system disrupted that in a way metric weights never had to. Half of 10 decimal hours landing on noon is a nice piece of trivia, but a shift ending at 2:50 decimal carries none of the cultural weight that \"5 o'clock\" already had for everyone living through the change. Metric weights and measures could be coordinated across borders relatively cleanly, but time zones were always a cultural artifact as much as a mathematical one — decimal time didn't solve a problem people actually had. It also ignored the day's astronomical basis in a way the 24-hour system, tied directly to Earth's rotation, never did."
  },
];

const faqs = [
  {
    question: "What is a decimal clock?",
    answer:
      "A decimal clock displays time using the French Revolutionary decimal time system, which divides the day into 10 decimal hours of 100 decimal minutes each. The decimal day runs from 0:00:00 at midnight to 9:99:99 just before the next midnight. Half the decimal day (5:00:00 decimal) corresponds exactly to noon in standard time."
  },
  {
    question: "How do I convert decimal time to standard time?",
    answer:
      "Multiply the decimal time value by 2.4 to get standard hours. For example, 5:00 decimal = 5 × 2.4 = 12:00 standard (noon). One decimal hour equals 2 hours and 24 standard minutes. One decimal minute equals 1 minute and 26.4 standard seconds. The conversion formula is: Standard hours = Decimal hours × 2.4."
  },
  {
    question: "What is decimal time format?",
    answer:
      "Decimal time is written as D:MM:SS where D is the decimal hour (0-9), MM is the decimal minute (00-99), and SS is the decimal second (00-99). The current decimal time is always 1/10 of the way through the decimal hour relative to the standard clock position in the day."
  },
  {
    question: "How does decimal time work?",
    answer:
      "The entire day is divided into 10 equal decimal hours. Each decimal hour is divided into 100 decimal minutes. Each decimal minute is divided into 100 decimal seconds. A single decimal second is 0.864 standard seconds. The system is mathematically elegant but was abandoned in 1795 after only 17 months because it conflicted with existing clock infrastructure and social customs."
  },
  {
    question: "What is the history of decimal time?",
    answer:
      "Decimal time was introduced in France on November 24, 1793 as part of the French Revolutionary metric reforms that also introduced the meter, liter, and kilogram. All Paris clocks were required to display decimal time alongside standard time. The system was officially suspended on April 7, 1795 and abandoned for regular use, though it remained legally valid in France until 1919."
  },
  {
    question: "Does anyone use decimal time today?",
    answer:
      "Decimal time is not used for civil timekeeping anywhere in the world. However, the Swatch Internet Time system (launched 1998) is a modern variant using 1000 .beats per day — a decimal approach without the French Revolutionary nomenclature. Some niche communities of metric system enthusiasts advocate for decimal time adoption but it has never gained mainstream use."
  },
];

const relatedLinks = [
  { href: "/tools/swatch-time-converter", name: "Swatch Time Converter" },
  { href: "/clocks/binary-clock", name: "Binary Clock" },
  { href: "/clocks/fibonacci-clock", name: "Fibonacci Clock" },
];

export default function DecimalClockPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <DecimalClock />
      <ClockSEOContent
        introText={introText}
        sections={sections}
        faqs={faqs}
        relatedLinks={relatedLinks}
        accent="#FCD34D"
      />
    </>
  );
}
