import type { Metadata } from "next";
import SpeedReadingMetronome from "@/components/clocks/experiences/SpeedReadingMetronome";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Speed Reading Test Online | Free WPM Test",
  description:
    "Free speed reading test. Measure your reading speed in words per minute. Compare to average reader statistics. Improve with the reading pacer. No signup required.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/speed-reading-test-online",
  },
  openGraph: {
    title: "Speed Reading Test Online | Free WPM Test",
    description:
      "Free speed reading test. Measure your reading speed in words per minute. Compare to average reader statistics.",
    url: "https://thegodoftime.com/clocks/speed-reading-test-online",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Speed Reading Test Online",
  url: "https://thegodoftime.com/clocks/speed-reading-test-online",
  description:
    "Free speed reading test. Measure your reading speed in words per minute and compare it to average reader statistics.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Words-per-minute reading speed test",
    "Comparison to population reading speed averages",
    "Reading pacer for practice",
    "Comprehension scoring",
  ],
};

const introText =
  "This speed reading test online measures your reading speed in words per minute and compares it to average reader statistics, plus a reading pacer to help you improve. Rather than guessing at your WPM, this free speed reading test has you read a passage of known length and timed duration, then does the math for you — a genuine test your reading speed workflow instead of a rough self-estimate. Students, professionals wanting to read faster, people curious about their WPM, book readers, and speed reading learners all use this reading speed calculator to find out exactly where they stand.";

const sections = [
  {
    title: "How to Take the Speed Reading Test",
    steps: [
      "Read the provided text passage at your normal, comfortable pace — don't rush.",
      "Click Done as soon as you finish reading.",
      "See your WPM result and where you rank against average readers, based on the passage length and your reading time."
    ],
  },
  {
    title: "Average Reading Speeds by Category",
    body:
      "Reading speed varies enormously by age, education, and training. A third grade student typically reads around 150 words per minute. The average adult reads between 200 and 300 WPM. College students average closer to 300 WPM. The average executive, who reads dense material professionally for years, hits roughly 575 WPM. Trained speed readers reach 1,000 to 1,700 WPM, and the world record sits at an extraordinary 4,700 WPM. There's an important caveat behind all of these numbers: comprehension drops significantly above 600-700 WPM for most people, so raw speed alone doesn't tell the whole story. For most readers, the real limiting factor is subvocalisation — silently \"hearing\" each word in your head as you read it — which caps natural reading speed at around 250 WPM until it's specifically trained away."
  },
];

const faqs = [
  {
    question: "What is a speed reading test?",
    answer:
      "A speed reading test measures how many words per minute you read at normal pace and comprehension. You read a standardised passage of known word count, record how long it takes, and the test calculates your WPM. Your result is then compared to population averages to show where you rank as a reader."
  },
  {
    question: "How do I take a speed reading test online?",
    answer:
      "Read the provided text passage at your normal comfortable pace — do not rush. Click Done when you finish. The test calculates your reading speed in words per minute based on the passage length and your reading time. Some tests also ask comprehension questions to ensure you understood what you read."
  },
  {
    question: "What is a good reading speed score?",
    answer:
      "The average adult reads between 200 and 300 words per minute with good comprehension. College students average around 300 WPM. If you read above 400 WPM with retained comprehension, you are in the upper range of natural readers. Speeds above 600 WPM typically involve reduced comprehension for most people unless they have trained extensively in speed reading techniques."
  },
  {
    question: "How can I improve my reading speed?",
    answer:
      "The biggest gains come from eliminating subvocalisation (the internal voice that reads each word), reducing regression (re-reading words you just read), and expanding your eye fixation span to take in multiple words per glance. Use the reading pacer on this tool to gradually push your speed while maintaining comprehension. Consistent daily practice of 20-30 minutes shows measurable improvement within 2-4 weeks."
  },
  {
    question: "What types of texts are used in speed reading tests?",
    answer:
      "This test uses excerpts from non-fiction prose at an adult reading level — the most reliable baseline for WPM measurement. Technical texts, poetry, and second-language reading are naturally slower and are not used in standard speed tests. To track improvement over time, use the same text type across multiple tests."
  },
  {
    question: "Can I track my reading speed progress?",
    answer:
      "Yes. Your test results are saved in browser storage so you can compare across sessions. Take the test at the same time of day under similar conditions for the most accurate comparison. Most people see measurable improvement after 2-4 weeks of consistent practice using the pacer tool to push slightly above their comfort zone each session."
  },
  {
    question: "Are there comprehension questions after the test?",
    answer:
      "Yes. After recording your WPM, a short set of comprehension questions tests your understanding of the passage. Your comprehension score is shown alongside your WPM — both metrics together give a complete picture of your reading efficiency. High WPM with low comprehension indicates skimming rather than true speed reading."
  },
];

const relatedLinks = [
  { href: "/clocks/reaction-time-test", name: "Reaction Time Test" },
  { href: "/clocks/time-blindness-test-online-free", name: "Time Blindness Test" },
  { href: "/clocks/pomodoro-timer-online", name: "Pomodoro Timer" },
];

export default function SpeedReadingMetronomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <SpeedReadingMetronome />
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
