import type { Metadata } from "next";
import ReactionTimeTester from "@/components/clocks/experiences/ReactionTimeTester";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Reaction Time Test | Average Is 200-250ms",
  description:
    "Free reaction time test. Click when the screen changes and see your speed in milliseconds. Average human reaction time is 200-250ms. No signup required.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/reaction-time-test",
  },
  openGraph: {
    title: "Reaction Time Test | Average Is 200-250ms",
    description:
      "Free reaction time test. Click when the screen changes and see your speed in milliseconds.",
    url: "https://thegodoftime.com/clocks/reaction-time-test",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Reaction Time Test",
  url: "https://thegodoftime.com/clocks/reaction-time-test",
  description:
    "Free reaction time test measuring visual reaction speed in milliseconds, compared to population averages.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Millisecond-accurate visual reaction test",
    "Comparison to human average reaction times",
    "Personal best tracking",
    "Works on desktop, tablet, and mobile",
  ],
};

const introText =
  "This reaction time test measures how fast you click the moment the screen changes, and the number to beat is well established: average human visual reaction time is 200-250ms. Gamers benchmarking their aim, drivers curious about real-world stopping distances, athletes, and anyone who's ever wondered how their reflexes compare to the average all use this test to get a fast, free reaction time test online with an instant millisecond result.";

const sections = [
  {
    title: "Average Reaction Time by Age and Category",
    body:
      "Reaction time results fall into recognizable bands: under 200ms is elite, roughly the top 1% of athletes and competitive gamers; 200-250ms is excellent, above the average adult; 250-300ms is average for most adults; 300-350ms is below average; and 350ms or slower typically reflects fatigue, age, or distraction rather than a fixed limit. By age, visual reaction time tends to run: 18-24 at roughly 190-220ms, 25-34 at 200-230ms, 35-44 at 210-240ms, 45-54 at 230-260ms, 55-64 at 250-280ms, and 65+ at 280ms or slower. A few specific categories stand out — Formula 1 drivers average around 130ms, professional esports players around 150-180ms, average gamers around 210-230ms, an untrained civilian around 250ms, and reaction time under the influence of alcohol commonly slows by roughly 100ms."
  },
  {
    title: "How to Improve Your Reaction Time",
    body:
      "Reaction time is trainable — regular practice shows measurable improvement within about 6-8 weeks of consistent testing. Sleep is the single biggest lever: reaction time degrades by 20-40% when you're sleep-deprived, often more than mild alcohol impairment. Caffeine reliably improves reaction time by roughly 10-15ms. Aerobic fitness correlates strongly with faster reaction time, since cardiovascular conditioning supports faster neural processing generally. Even reducing your screen brightness can slightly improve stimulus detection speed, a small but real effect worth knowing if you're chasing a personal best."
  },
];

const faqs = [
  {
    question: "What is a reaction time test?",
    answer:
      "A reaction time test measures how quickly you respond to a visual or auditory stimulus. In this test, you click as soon as a color change appears on screen. The time between the stimulus appearing and your click is measured in milliseconds and compared to population averages."
  },
  {
    question: "How can I improve my reaction time?",
    answer:
      "Consistent practice with reaction time exercises shows measurable improvement within 6-8 weeks. Adequate sleep is the single biggest factor — sleep deprivation slows reaction time more than being over the legal alcohol limit for driving. Regular aerobic exercise also significantly improves neural processing speed."
  },
  {
    question: "What is the average reaction time for adults?",
    answer:
      "The average visual reaction time for adults is 250 milliseconds (0.25 seconds). Athletes average around 200ms, professional gamers around 170ms, and F1 drivers test at approximately 130ms through intensive training and selection. Reaction time naturally slows with age, typically adding 10-15ms per decade after age 24."
  },
  {
    question: "Are online reaction time tests accurate?",
    answer:
      "Online tests measure the combined time of your brain's reaction plus your computer's display lag and input device delay. A standard monitor adds 8-16ms of display latency, and wireless mice add 2-8ms. For this reason, your result may be 10-25ms slower than a laboratory test. Wired peripherals and a high-refresh monitor give the most accurate online measurement."
  },
  {
    question: "How does age affect reaction time?",
    answer:
      "Reaction time peaks between ages 18 and 24, then gradually slows. The increase is approximately 10-15ms per decade — a 25-year-old averages 210ms while a 65-year-old averages 275ms. This slowdown is normal and primarily reflects changes in neural conduction speed. Regular exercise can significantly reduce age-related decline."
  },
  {
    question: "What are some examples of reaction time tests?",
    answer:
      "The most common is the visual reaction test (click when the screen changes colour). Auditory tests (respond to a sound) typically show 20-30ms faster results than visual tests. Choice reaction tests (press one of several buttons based on which stimulus appears) are slower and test decision speed in addition to reaction speed."
  },
  {
    question: "How can I test my reaction time at home?",
    answer:
      "Use this online test — it requires only a browser and works on desktop, tablet, or mobile. For a completely offline test, the classic ruler drop test works: hold a ruler at the top, have a partner hold their fingers around the bottom without touching it, then drop it and measure how far it falls before they catch it. Every 5cm corresponds to approximately 100ms of reaction time."
  },
];

const relatedLinks = [
  { href: "/clocks/time-blindness-test-online-free", name: "Time Blindness Test" },
  { href: "/clocks/timer-game-online", name: "Timer Game Online" },
  { href: "/clocks/stopwatch", name: "Stopwatch" },
];

export default function ReactionTimeTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <ReactionTimeTester />
      <ClockSEOContent
        introText={introText}
        sections={sections}
        faqs={faqs}
        relatedLinks={relatedLinks}
        accent="#F59E0B"
      />
    </>
  );
}
