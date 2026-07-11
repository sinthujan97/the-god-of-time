import type { Metadata } from "next";
import RamenTimer from "@/components/clocks/experiences/RamenTimer";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Ramen Timer | 3-Minute Instant Noodle Countdown",
  description:
    "Free ramen timer. Set the perfect 3-minute countdown for instant ramen with a noodle-themed animation and sound alert. Works on any device. No signup.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/ramen-timer",
  },
  openGraph: {
    title: "Ramen Timer | 3-Minute Instant Noodle Countdown",
    description:
      "Free ramen timer. Set the perfect countdown for instant ramen with a noodle-themed animation and sound alert.",
    url: "https://thegodoftime.com/clocks/ramen-timer",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ramen Timer",
  url: "https://thegodoftime.com/clocks/ramen-timer",
  description:
    "Free ramen timer with 2, 3, 3:30, and 4 minute presets, a cooking animation, and a sound alert when your noodles are ready.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "2, 3, 3:30, and 4 minute cook time presets",
    "Animated noodle-cooking progress ring",
    "Sound alert when time is up",
    "Works on any device, no signup",
  ],
};

const introText =
  "This ramen timer gives you preset timers for the most common instant ramen cook times — 2 minutes for thin noodles, 3 minutes for standard cup noodles, and 4 minutes for thicker restaurant-style noodles — so you never have to guess or set a generic phone timer again. A visual countdown paired with a sound alert means you can walk away while your ramen cooks and still catch the exact moment it's ready, whether you're microwaving a cup at your desk or boiling a pot on the stove.";

const sections = [
  {
    title: "How Long Should Ramen Cook?",
    body:
      "Cook times vary more than most people realize by noodle type. Standard cup noodles run about 3 minutes. Instant packet ramen typically falls in the 2-3 minute range depending on brand. Fresh ramen noodles cook fastest, often done in just 1-3 minutes since they haven't been dried and pre-cooked like instant varieties. Dried noodles (not the instant kind, but standalone dried ramen or somen-style noodles) usually need 4-5 minutes. Restaurant-style fresh tonkotsu noodles cook the fastest of all, often ready in 1-2 minutes given how thin and fresh they typically are. As a general rule, add 30 seconds to any of these times if you prefer softer noodles, or subtract 30 seconds if you like them firmer, closer to al dente."
  },
  {
    title: "Tips for Better Instant Ramen",
    body:
      "Use slightly less water than the packet instructions call for — it concentrates the broth and gives you a noticeably stronger flavor without changing the cook time. Add the seasoning packet at the end of cooking rather than the start; adding it early lets some of the flavor cook off and dulls the final result. If you like a soft-boiled egg in your ramen, drop it in around the 1:30 mark so it finishes cooking alongside the noodles rather than turning hard. And cover your bowl while it's cooking or resting — trapping the steam keeps the noodles cooking evenly and helps the flavor packet fully dissolve into the broth."
  },
];

const faqs = [
  {
    question: "How do I set the timer for ramen?",
    answer:
      "Pick one of the four presets — 2:00, 3:00, 3:30, or 4:00 — based on the type of ramen you're cooking, then press Start. The progress ring and countdown update in real time, and a sound alert plays the moment the timer reaches zero."
  },
  {
    question: "What is the ideal cooking time for instant ramen?",
    answer:
      "Most instant ramen packets and standard cup noodles are ready in 3 minutes. Thinner noodles can be done in 2 minutes, while thicker or dried varieties may need up to 4-5 minutes. Check the packet if you have it, but 3 minutes is the safest default for standard instant ramen."
  },
  {
    question: "Can I customize the cook time?",
    answer:
      "The timer offers four common presets (2, 3, 3:30, and 4 minutes) covering the vast majority of instant ramen and cup noodle products. These cover essentially every common cook time printed on ramen packaging, so most people won't need anything outside this range."
  },
  {
    question: "What is the difference between cup ramen and packet ramen timing?",
    answer:
      "Cup ramen is typically cooked by adding boiling water and waiting, usually around 3 minutes, since the cup retains heat well and the noodles are cut thinner for faster rehydration. Packet ramen is usually boiled directly in a pot, which can cook slightly faster or slower depending on how vigorously the water is boiling and how much water you use."
  },
  {
    question: "How does the ramen timer differ from a regular kitchen timer?",
    answer:
      "A regular kitchen timer requires you to know and manually enter the right cook time yourself. This ramen timer has the common instant ramen cook times already built in as one-tap presets, plus a visual cooking animation and progress ring so you can tell at a glance how much longer you have left without reading numbers."
  },
];

const relatedLinks = [
  { href: "/clocks/countdown-timer-online", name: "Countdown Timer" },
  { href: "/clocks/workout-timer-online-free", name: "Workout Timer Online Free" },
  { href: "/realms/absurd-clocks", name: "Absurd Clocks" },
];

export default function RamenTimerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <RamenTimer />
      <ClockSEOContent
        introText={introText}
        sections={sections}
        faqs={faqs}
        relatedLinks={relatedLinks}
        accent="#FF9F00"
      />
    </>
  );
}
