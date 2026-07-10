import type { Metadata } from "next";
import RhythmTest from "@/components/clocks/experiences/RhythmTest";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Tap to the Beat Test | Rhythm Accuracy Test",
  description:
    "Free tap to the beat test. Keep time after the metronome cue fades and measure your rhythm accuracy in milliseconds. No signup.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/tap-to-the-beat-test",
  },
  openGraph: {
    title: "Tap to the Beat Test | Rhythm Accuracy Test",
    description:
      "Free tap to the beat test. Keep time after the metronome cue fades and measure your rhythm accuracy in milliseconds.",
    url: "https://thegodoftime.com/clocks/tap-to-the-beat-test",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tap to the Beat Test",
  url: "https://thegodoftime.com/clocks/tap-to-the-beat-test",
  description:
    "Free beat test measuring rhythm accuracy and internal tempo tracking in milliseconds after an audio cue fades to silence.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Millisecond-precision beat alignment scoring",
    "Metronome cue that fades into silence",
    "Internal tempo tracking measurement",
    "Instant results with no signup",
  ],
};

const introText =
  "This tap to the beat test measures how accurately you can keep time on your own, after an audio metronome cue plays a few beats and then fades into silence — you keep tapping at the same tempo purely from your internal sense of timing, and the test scores your deviation in milliseconds. It connects directly to the same time-perception skills measured by our Time Blindness Test and Timer Game: the ability to track elapsed time without an external cue is a core component of internal timing, and people who score poorly here often notice similar patterns when estimating how long a task will take. Musicians tightening their timing, people curious about their internal tempo, and anyone exploring the ADHD-timing connection all use this beat test the same way — listen, tap, and see how close you land.";

const sections = [
  {
    title: "How Rhythm Accuracy Relates to Time Perception",
    body:
      "Keeping a steady beat without an external cue relies on the basal ganglia, a brain region that also handles a range of other timing and movement-sequencing functions — which is part of why rhythm accuracy and general time perception tend to move together. The underlying skill is called beat induction: the brain's ability to detect and continue a regular pulse even after the actual audio stops, essentially generating an internal clock signal to keep tapping in sync. Most people track tempo most accurately in a moderate range, roughly 80-140 beats per minute, with accuracy dropping off at very slow tempos (where drift accumulates between taps) and very fast tempos (where motor timing becomes the limiting factor rather than perception). There's also a well-documented ADHD connection: studies on beat-tapping tasks consistently find larger timing deviations in people with ADHD, tying back to the same basal ganglia and internal-clock mechanisms measured by our Time Blindness Test."
  },
  {
    title: "What Affects Your Rhythm Accuracy Score?",
    body:
      "Tempo familiarity matters — a beat close to your natural walking pace or resting heart rate (both common internal tempo references) is typically easier to hold than an unfamiliar tempo. Attention and fatigue play a large role too: divided attention or tiredness measurably increases tapping deviation, since maintaining the internal pulse takes ongoing cognitive resources, not just a one-time read of the tempo. Musical training produces a consistent, well-documented advantage — trained musicians typically show tighter, more consistent beat alignment than non-musicians due to years of practice synchronizing to external timing cues. Caffeine and stress both tend to push taps slightly early (anticipatory tapping), while sleep deprivation increases variability in both directions rather than pushing consistently one way."
  },
];

const faqs = [
  {
    question: "What is a tap to the beat test?",
    answer:
      "A tap to the beat test measures how accurately you can maintain a steady tempo using only your internal sense of timing. An audio metronome plays several beats to establish the tempo, then fades into silence while you continue tapping at what you believe is the same pace. Your taps are compared against the true beat timing and scored as a deviation in milliseconds."
  },
  {
    question: "How is my rhythm accuracy score calculated?",
    answer:
      "The test measures the time gap between each of your taps and the true underlying beat, in milliseconds, then averages your deviation across all taps after the audio cue fades. A lower average deviation means tighter, more accurate timing. Consistent early or late drift is also tracked separately from random variation, since the two point to different underlying timing issues."
  },
  {
    question: "What is a good score on the beat test?",
    answer:
      "Deviations under 30ms are considered excellent and are typical of trained musicians. 30-60ms is a solid average result for most adults. Deviations above 100ms suggest your internal tempo is drifting noticeably from the true beat, which is common for people who haven't had musical training or who are tapping along to an unfamiliar tempo."
  },
  {
    question: "Why do I keep speeding up or slowing down?",
    answer:
      "Consistent speeding up (rushing) or slowing down (dragging) once the audio cue fades is a common pattern and reflects how your internal clock drifts over time without an external reference to correct against. Rushing is more common at faster tempos and dragging at slower ones. This drift pattern is different from random timing noise and tends to improve with practice at the specific tempo you're rushing or dragging on."
  },
  {
    question: "Is there a connection between rhythm accuracy and ADHD?",
    answer:
      "Yes — research on beat-tapping tasks consistently finds larger and more variable timing deviations in people with ADHD compared to neurotypical peers, tied to the same basal ganglia and internal-clock mechanisms that also affect broader time perception. This is the same underlying connection measured by our Time Blindness Test, and people who score poorly on one often notice similar patterns on the other."
  },
  {
    question: "How can I improve my rhythm accuracy?",
    answer:
      "Regular practice tapping along to a metronome at a range of tempos builds tighter beat induction over time. Musical training — even informal practice with an instrument — reliably produces measurable improvement in timing accuracy. Reducing distractions during practice also helps, since maintaining an internal beat is an attention-dependent skill that degrades under divided focus or fatigue."
  },
];

const relatedLinks = [
  { href: "/clocks/time-blindness-test-online-free", name: "Time Blindness Test" },
  { href: "/clocks/timer-game-online", name: "Timer Game Online" },
  { href: "/clocks/reaction-time-test", name: "Reaction Time Test" },
];

export default function TapToTheBeatTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <RhythmTest />
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
