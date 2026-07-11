import type { Metadata } from "next";
import AbsoluteLunarAnchor from "@/components/clocks/experiences/AbsoluteLunarAnchor";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Moon Phase Clock Online | Current Lunar Phase",
  description:
    "Free moon phase clock. See the current lunar phase, moon rise and set times, and full moon countdown for any location. No signup required.",
  alternates: {
    canonical: "/clocks/moon-phase-clock-online",
  },
  openGraph: {
    title: "Moon Phase Clock Online | Current Lunar Phase",
    description:
      "Free moon phase clock. See the current lunar phase, moon rise and set times, and full moon countdown for any location.",
    url: "/clocks/moon-phase-clock-online",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Moon Phase Clock Online",
  url: "https://thegodoftime.com/clocks/moon-phase-clock-online",
  description:
    "Free moon phase clock. See the current lunar phase, moon rise and set times, and full moon countdown for any location.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Live lunar phase visualization",
    "Moon rise and set times by location",
    "Full moon countdown",
    "Illumination percentage tracking",
  ],
};

const introText =
  "This moon phase clock online shows the current lunar phase with a live visualization, moon rise and set times for your location, and a countdown to the next full moon. Rather than looking up a static moon phase calendar, this real time moon phase clock updates continuously as the Moon moves through its roughly 29.5-day lunar cycle, so the current moon phase time and date you see is always accurate to the minute. Gardeners using lunar planting calendars, photographers timing moon shots, fishermen, astrology enthusiasts, and curious users alike rely on this clock to know exactly where the Moon stands right now.";

const sections = [
  {
    title: "The 8 Moon Phases Explained",
    body:
      "The Moon moves through 8 distinct phases over its 29.5-day lunar cycle around Earth. New Moon is 0% illuminated and effectively invisible from Earth, marking the start of the cycle. Waxing Crescent follows, with a sliver of the right side lit and growing each night. First Quarter shows exactly the right half of the disc illuminated. Waxing Gibbous is more than half lit and still growing toward fullness. Full Moon is 100% illuminated, the most visually dramatic phase and the one most lunar calendars are built around. Waning Gibbous is more than half lit but now shrinking. Last Quarter shows the left half illuminated, the mirror image of First Quarter. Waning Crescent closes the cycle with just a sliver of the left side lit, shrinking back toward New Moon. This entire 8-phase cycle repeats every 29.5 days, which is why full moons don't fall on the same calendar date each month."
  },
  {
    title: "How to Use Moon Phases for Gardening",
    body:
      "Biodynamic and lunar gardening traditions time planting activities to the Moon's phase, believing gravitational pull affects moisture in soil and plants. From New Moon to First Quarter, plant leafy greens — this is considered the ideal window for above-ground leaf growth. From First Quarter to Full Moon, plant fruiting crops like tomatoes and peppers, as this period is associated with strong upward growth energy. From Full Moon to Last Quarter, plant root vegetables — the energy is believed to shift downward into roots and bulbs during this waning half. From Last Quarter back to New Moon, focus on pruning and harvesting rather than planting, letting the soil rest before the next cycle begins."
  },
];

const faqs = [
  {
    question: "How does a moon phase clock work?",
    answer:
      "A moon phase clock calculates the current position of the Moon in its 29.5-day cycle around Earth and displays the corresponding phase. It uses your location to show local moon rise and set times and the percentage of the lunar disc currently illuminated. The phase updates in real time as the Moon moves through its orbit."
  },
  {
    question: "How can I set my moon phase clock accurately for my location?",
    answer:
      "Enable location access in your browser or enter your city manually. The clock adjusts moon rise, moon set, and transit times to your specific coordinates. This matters because the Moon rises approximately 50 minutes later each day and the exact time varies by latitude and longitude."
  },
  {
    question: "What are the different moon phases displayed on the clock?",
    answer:
      "The clock shows all 8 primary lunar phases: New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, and Waning Crescent. Each phase is shown with its illumination percentage and the number of days until the next phase transition."
  },
  {
    question: "Can I customize the timezone for my moon phase clock?",
    answer:
      "Yes. The clock defaults to your browser's detected timezone but you can manually select any timezone to see moon phases from a different location. This is useful for planning photography trips or checking conditions at a different location in advance."
  },
  {
    question: "What is the best way to use a moon phase clock for gardening?",
    answer:
      "Plant above-ground crops (leafy greens, herbs, flowers) during the waxing phases from new moon to full moon when sap flows upward. Plant root vegetables and bulbs during the waning phases from full moon to new moon. Prune and harvest during the last quarter for best results according to biodynamic gardening principles."
  },
  {
    question: "How do I know when the next full moon is?",
    answer:
      "The countdown to the next full moon is displayed prominently on the clock showing days, hours, and minutes remaining. Full moons occur approximately every 29.5 days. You can also click through to future months in the lunar calendar to see the exact dates of upcoming full moons for the rest of the year."
  },
];

const relatedLinks = [
  { href: "/clocks/sunrise-sunset-calculator", name: "Sunrise Sunset Calculator" },
  { href: "/clocks/circadian-rhythm-clock", name: "Circadian Rhythm Clock" },
  { href: "/clocks/night-clock-online", name: "Night Clock Online" },
];

export default function AbsoluteLunarAnchorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <AbsoluteLunarAnchor />
      <ClockSEOContent
        introText={introText}
        sections={sections}
        faqs={faqs}
        relatedLinks={relatedLinks}
        accent="#FBBF24"
      />
    </>
  );
}
