import type { Metadata } from "next";
import TimeBlindnessTester from "@/components/clocks/experiences/TimeBlindnessTester";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Time Blindness Test | Do You Have Time Blindness?",
  description:
    "Free time blindness test. Measure your time perception accuracy. Find out if you have ADHD-related time blindness. Instant results. No signup.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/time-blindness-test",
  },
  openGraph: {
    title: "Time Blindness Test | Do You Have Time Blindness?",
    description:
      "Free time blindness test. Measure your time perception accuracy. Find out if you have ADHD-related time blindness.",
    url: "https://thegodoftime.com/clocks/time-blindness-test",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Time Blindness Test",
  url: "https://thegodoftime.com/clocks/time-blindness-test",
  description:
    "Free time blindness test. Measure your time perception accuracy and find out if you have ADHD-related time blindness.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Hidden-timer time perception test",
    "30 second, 1 minute, and 5 minute intervals",
    "Instant accuracy scoring",
    "ADHD time blindness screening context",
  ],
};

const introText =
  "This time blindness test measures how accurately you perceive the passage of time — people with time blindness significantly over- or underestimate time intervals without realizing it. Rather than asking you to self-report, this ADHD time blindness test hides the clock entirely and has you stop it purely on internal feel, producing a genuine time blindness quiz result instead of a guess dressed up as one. People with ADHD or suspected ADHD, anyone who struggles with punctuality or time management, parents testing their children, and therapists and coaches all use this test to put a number on something that's usually only described anecdotally.";

const sections = [
  {
    title: "How to Take the Time Blindness Test",
    steps: [
      "Select a target time interval — 30 seconds, 1 minute, or 5 minutes.",
      "Press start, then try to stop at exactly the right time without counting in your head.",
      "See how accurate your time perception is — the timer is never visible during the test, which is the whole point."
    ],
  },
  {
    title: "What Is Time Blindness?",
    body:
      "Time blindness is the inability to sense time passing — not a vision problem, but a neurological one. It is strongly associated with ADHD, with over 90% of people with ADHD reporting some degree of time blindness. Dr. Russell Barkley's research frames ADHD brains as living in \"now\" versus \"not now\" — with none of the in-between sense of approaching deadlines that neurotypical time perception provides automatically. It's important to distinguish time blindness from poor time management: time blindness is a neurological difference in how time is sensed, not laziness or a lack of trying. Common signs include being consistently late despite genuinely intending to be on time, losing track of hours during a task, underestimating how long something will take, and being repeatedly surprised at how much time has actually passed."
  },
];

const faqs = [
  {
    question: "What is time blindness and how does it affect me?",
    answer:
      "Time blindness is the inability to accurately sense the passage of time. People with time blindness genuinely cannot feel how much time has elapsed — they may think 20 minutes have passed when it has been 2 hours. It is strongly associated with ADHD and affects approximately 90% of people with the condition. It is a neurological difference, not a personality flaw or laziness."
  },
  {
    question: "How can I test for time blindness online?",
    answer:
      "This test asks you to stop a hidden timer at a target interval (30 seconds, 1 minute, or 5 minutes) without counting or using any external cues. Your result shows how far off you were from the target. Consistently stopping significantly early or late — especially by 30% or more — suggests impaired time perception worth discussing with a healthcare provider."
  },
  {
    question: "What are common symptoms of time blindness?",
    answer:
      "Common symptoms include: chronic lateness despite trying to be on time, consistently underestimating how long tasks take, losing track of hours while hyperfocused, being surprised that so much time has passed, difficulty transitioning between activities because you lose track of when to stop, and struggling to plan backward from a deadline."
  },
  {
    question: "What strategies can help manage time blindness?",
    answer:
      "Effective strategies include: visible analog clocks in every room (not phone clocks that require unlocking), time timers that show time as a decreasing red disc, alarms set 10 minutes before transitions not at the transition time itself, time-blocking calendar schedules, working with a body double, and building buffer time into every task estimate."
  },
  {
    question: "Is time blindness related to ADHD?",
    answer:
      "Yes, very strongly. Dr. Russell Barkley, a leading ADHD researcher, describes ADHD as fundamentally a disorder of time blindness. People with ADHD have difficulty using their sense of time to guide behaviour, plan future actions, and regulate the distance between now and a future deadline. Time blindness is considered one of the most impairing aspects of ADHD in daily life."
  },
  {
    question: "Can time blindness be treated or improved?",
    answer:
      "Time blindness does not have a cure but it can be managed. Stimulant medications used for ADHD improve time perception in many people. External tools (visible clocks, timers, alarms) compensate for the impaired internal sense of time. Cognitive strategies like time estimation practice (using this test regularly) can improve accuracy over time. Working with an ADHD coach can help build personalised systems."
  },
  {
    question: "What are some examples of time blindness in daily life?",
    answer:
      "Starting to get ready for a meeting 5 minutes before it begins when you need 30. Sitting down to work for \"a few minutes\" and discovering 2 hours have passed. Missing dinner because you lost track of time cooking. Consistently turning in work late despite intending to be early. Telling someone you will be there in 10 minutes then arriving 45 minutes later, genuinely surprised at how long it took."
  },
];

const relatedLinks = [
  { href: "/clocks/circadian-rhythm-clock", name: "Circadian Rhythm Clock" },
  { href: "/clocks/reaction-time", name: "Reaction Time Test" },
  { href: "/clocks/timer-game-online", name: "Timer Game Online" },
];

export default function TimeBlindnessPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <TimeBlindnessTester />
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
