import type { Metadata } from "next";
import WorkingMemoryTest from "@/components/clocks/experiences/WorkingMemoryTest";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Working Memory Test Online | Free Cognitive Test",
  description:
    "Free working memory test online. Measure your digit span and spatial memory in 3 minutes. Compare your score to age norms. No signup needed.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/working-memory-test-online",
  },
  openGraph: {
    title: "Working Memory Test Online | Free Cognitive Test",
    description:
      "Free working memory test online. Measure your digit span and spatial memory in 3 minutes.",
    url: "https://thegodoftime.com/clocks/working-memory-test-online",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Working Memory Test Online",
  url: "https://thegodoftime.com/clocks/working-memory-test-online",
  description:
    "Free working memory test measuring digit span and spatial span, compared against age norms.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Forward and backward digit span testing",
    "Spatial span grid memory testing",
    "Adaptive difficulty that finds your limit automatically",
    "Instant results with no signup",
  ],
};

const introText =
  "This working memory test online measures the mental workspace that holds and manipulates information for a few seconds at a time — specifically your digit span (how many numbers you can hold in mind) and your spatial span (how many positions you can track simultaneously). People curious about their cognitive capacity, those with ADHD or brain fog concerns, students preparing for exams, and anyone who's noticed recent memory lapses all use this working memory test for adults to get a fast answer. Unlike the NIH Toolbox, which requires an account and was built for clinical researchers rather than individuals, this short term memory test online free runs entirely in your browser and gives you a result in about three minutes — no signup, no waiting room.";

const sections = [
  {
    title: "What Is Working Memory?",
    body:
      "Working memory is often confused with short-term memory, but they aren't the same thing — short-term memory is passive storage, while working memory is active manipulation of information while it's held in mind. Psychologist Alan Baddeley's influential model breaks it into three parts: the phonological loop, which handles verbal and auditory information; the visuospatial sketchpad, which handles visual and spatial information; and the central executive, which coordinates both and directs attention between them. The average adult digit span is 7 ± 2 items, a figure established by Miller's Law back in 1956 and still holding up remarkably well today. Working memory capacity isn't just a curiosity — it reliably predicts academic performance, reading comprehension, general problem-solving ability, and even how well someone responds to ADHD treatment. Importantly, it isn't fixed either: studies on consistent working memory training show 20-40% improvement in capacity over roughly 8 weeks of regular practice, meaning a low score today is a starting point, not a ceiling."
  },
  {
    title: "Working Memory Test Results — What They Mean",
    body:
      "For forward digit span, under 5 items is below average, 5-6 items is average, 7 items is above average, and 8 or more is superior. For spatial span, under 4 items is below average, 4-5 items is average, 6 items is above average, and 7 or more is superior. Several factors shift your score on any given day: sleeping 6 hours instead of 8 measurably reduces working memory span by 1-2 items, and stress or anxiety significantly impairs the central executive function that coordinates everything. Caffeine produces a modest improvement specifically on attention-dependent working memory tasks. ADHD typically reduces span by 1-2 items on average compared to neurotypical peers — a real, measurable difference, though far from the whole picture of the condition."
  },
];

const faqs = [
  {
    question: "What is a working memory test?",
    answer:
      "A working memory test measures how many items your brain can hold and actively process at the same time. Unlike a simple short-term memory test, working memory tests require you to manipulate or reorder information — not just recall it in the order it was presented. Common formats include digit span (numbers forward and backward) and spatial span (remembering sequences of lit positions on a grid)."
  },
  {
    question: "How do I take a working memory test online?",
    answer:
      "The test runs entirely in your browser with no download or account required. A sequence of digits or grid positions appears briefly, then disappears. Reproduce the sequence in the correct order. Each round adds one more item until you make two errors at the same length. Your score is the longest sequence you recalled correctly."
  },
  {
    question: "What types of working memory tests are available here?",
    answer:
      "This assessment includes three subtests: forward digit span (repeat numbers in order), backward digit span (repeat numbers in reverse order — a harder test of working memory manipulation), and spatial span (remember which grid squares lit up in sequence). Each subtest takes about 90 seconds."
  },
  {
    question: "How can I improve my working memory scores?",
    answer:
      "Working memory responds well to targeted practice. Consistent use of n-back training (a widely researched method) shows 20-40% improvement over 8 weeks. Aerobic exercise significantly improves working memory — even a single 20-minute run provides a measurable boost lasting several hours. Quality sleep is the most impactful single factor: consistently sleeping 7-9 hours per night adds 1-2 items to your effective working memory span."
  },
  {
    question: "What does a working memory test measure?",
    answer:
      "Working memory capacity — specifically how many items you can hold in conscious awareness while simultaneously processing or manipulating them. It measures the phonological loop (verbal working memory), visuospatial sketchpad (spatial working memory), and implicitly the central executive that coordinates both. Lower scores are associated with reading difficulties, ADHD, and certain neurological conditions. Higher scores predict academic performance and fluid intelligence."
  },
  {
    question: "Are there different levels of difficulty?",
    answer:
      "Yes. The test adapts automatically — it starts easy and increases the sequence length until you reach your limit. There is no need to select a difficulty level. Once you complete the standard assessment, a hard mode uses backward sequences and mixed digit-letter spans for a more demanding cognitive challenge."
  },
  {
    question: "How often can I retake the working memory test?",
    answer:
      "You can retake immediately but results are most meaningful when compared across similar conditions. Practice effects can inflate your score by 1-2 items after several attempts within the same session. For the most accurate baseline, take the test once in the morning before caffeine, compare a week later under the same conditions, and use the second result as your true score."
  },
];

const relatedLinks = [
  { href: "/clocks/reaction-time-test", name: "Reaction Time Test" },
  { href: "/clocks/time-blindness-test-online-free", name: "Time Blindness Test" },
  { href: "/clocks/pomodoro-timer-online", name: "Pomodoro Timer Online" },
];

export default function WorkingMemoryTestOnlinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <WorkingMemoryTest />
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
