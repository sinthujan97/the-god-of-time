import type { Metadata } from "next";
import Stopwatch from "@/components/clocks/experiences/Stopwatch";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Stopwatch Online | Free With Laps & Milliseconds",
  description:
    "Free online stopwatch with lap times, split times, and millisecond precision. Fullscreen mode and keyboard controls. No signup required.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/stopwatch-online",
  },
  openGraph: {
    title: "Stopwatch Online | Free With Laps & Milliseconds",
    description:
      "Free online stopwatch with lap times, split times, and millisecond precision.",
    url: "https://thegodoftime.com/clocks/stopwatch-online",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Stopwatch Online",
  url: "https://thegodoftime.com/clocks/stopwatch-online",
  description:
    "Free online stopwatch with lap time tracking, fastest/slowest lap highlighting, CSV export, and keyboard shortcuts.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Lap time tracking with fastest/slowest highlighting",
    "Precision timing to the hundredth of a second",
    "Keyboard shortcuts for start, lap, and reset",
    "CSV export of lap times",
  ],
};

const introText =
  "This stopwatch online tool times elapsed duration with lap tracking and precision timing down to the hundredth of a second — close enough to millisecond precision for virtually any timing task. Every lap you record is compared against the others automatically, with your fastest and slowest laps flagged so you can see your pacing at a glance, which is the core stopwatch with lap times feature most basic online stopwatch tools skip. Athletes timing intervals, coaches recording laps across a training session, students using timed study techniques, developers benchmarking code by hand, and teachers timing class activities all use it the same way. Keyboard controls make it fast to operate without reaching for the mouse: press spacebar to start or stop, L to record a lap, and R to reset.";

const sections = [
  {
    title: "Lap Times, Splits, and Precision Timing",
    body:
      "Each time you record a lap, the stopwatch logs both the lap time (the duration since your last lap) and the total elapsed time at that point, so you can review pacing either as individual segments or as a running total. Once you've logged more than one lap, the fastest lap is marked and the slowest lap is marked, making it easy to spot your best and worst segments in a long set without doing the comparison yourself. Timing precision runs to the hundredth of a second, which covers the overwhelming majority of use cases that call themselves millisecond-precision timing, from interval training splits to short coding benchmarks. When a session is done, export your full lap log to CSV to review pacing later or drop it into a spreadsheet alongside other training data."
  },
  {
    title: "Stopwatch vs. Timer — What's the Difference",
    body:
      "A stopwatch counts up from zero and measures how long something takes, with no predetermined end point — you decide when to stop it. A timer counts down from a set duration and alerts you when that duration expires. Use a stopwatch when you don't know in advance how long a task will take and want to measure it after the fact: a workout set, a study session, a presentation you're rehearsing. Use a timer when you already know the duration you want and need an alert at the end of it, such as a Tabata round or a Pomodoro focus block. Many training and study workflows actually use both — a stopwatch to record how long something took this time, and a timer to hold yourself to a target duration next time."
  },
];

const faqs = [
  {
    question: "Does the stopwatch track lap times?",
    answer:
      "Yes. Press the Lap button (or the L key) while the stopwatch is running to record a lap. Each entry shows both the individual lap time and the total elapsed time at that point. Once you've recorded more than one lap, your fastest and slowest laps are automatically highlighted."
  },
  {
    question: "How precise is the online stopwatch?",
    answer:
      "Timing is measured to the hundredth of a second, shown alongside minutes, seconds, and hours once your session runs that long. This level of precision is accurate enough for interval training, study sessions, and most manual timing tasks."
  },
  {
    question: "What are the keyboard shortcuts for the stopwatch?",
    answer:
      "Press the spacebar to start or stop the stopwatch, L to record a lap while it's running, and R to reset it back to zero. This lets you operate the stopwatch without reaching for the mouse, which matters when you're timing something with your hands busy."
  },
  {
    question: "Can I export my lap times?",
    answer:
      "Yes. Once you've recorded at least two laps, an export option lets you download your full lap log as a CSV file, listing each lap number, its individual lap time, and the cumulative elapsed time — useful for reviewing pacing later or logging training data over time."
  },
  {
    question: "What is the difference between a stopwatch and a timer?",
    answer:
      "A stopwatch counts up from zero with no predetermined end, measuring how long something actually takes. A timer counts down from a duration you set and alerts you when it reaches zero. Use a stopwatch when you want to measure an unknown duration, and a timer when you want an alert after a specific, known duration."
  },
  {
    question: "Is this stopwatch good for studying?",
    answer:
      "Yes. Many students use a stopwatch to measure how long a study block actually took without capping it in advance, then compare session lengths over the lap log. For a structured study session with fixed work and break intervals instead, the Pomodoro Timer is built specifically for that format."
  },
];

const relatedLinks = [
  { href: "/clocks/workout-timer-online-free", name: "Workout Timer Online Free" },
  { href: "/clocks/countdown-timer-online", name: "Countdown Timer Online" },
  { href: "/clocks/pomodoro-timer-online", name: "Pomodoro Timer Online" },
];

export default function StopwatchOnlinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <Stopwatch />
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
