import type { Metadata } from "next";
import IntervalTimer from "@/components/clocks/experiences/IntervalTimer";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Workout Timer Online Free | HIIT Tabata Intervals",
  description:
    "Free workout timer online. HIIT, Tabata, EMOM, and custom interval modes with audio alerts and color-coded phases. No app, no signup required.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/workout-timer-online-free",
  },
  openGraph: {
    title: "Workout Timer Online Free | HIIT Tabata Intervals",
    description:
      "Free workout timer online. HIIT, Tabata, EMOM, and custom interval modes with audio alerts.",
    url: "https://thegodoftime.com/clocks/workout-timer-online-free",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Workout Timer Online Free",
  url: "https://thegodoftime.com/clocks/workout-timer-online-free",
  description:
    "Free configurable interval timer for HIIT, Tabata, EMOM, and custom work/rest workouts with audio alerts and color-coded phases.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Tabata, HIIT, EMOM, and custom presets",
    "Color-coded work and rest phases",
    "Audio alerts at each phase transition",
    "Fullscreen mode for gym use",
  ],
};

const introText =
  "This workout timer online free tool is a configurable interval timer for HIIT, Tabata, EMOM, circuit training, and any custom work/rest interval combination you need. Home gym exercisers, CrossFit athletes, Tabata practitioners, runners doing interval training, and anyone doing timed sets all use this workout interval timer the same way — pick a mode, hit start, and let the audio cues carry the workout so you never have to watch the screen. Preset modes load common workout formats instantly: Tabata loads as 20 seconds work, 10 seconds rest, for 8 rounds with a single tap. There's no app to download, and fullscreen mode makes it easy to prop a phone up on gym equipment and read it from across the room.";

const sections = [
  {
    title: "Workout Timer Modes Explained",
    body:
      "Tabata is 20 seconds of work followed by 10 seconds of rest, repeated for 8 rounds — 4 minutes total per exercise. Developed by Dr. Izumi Tabata, it's proven to improve both aerobic and anaerobic capacity, and the preset loads that exact 20/10/8 configuration instantly. HIIT (High Intensity Interval Training) uses a customizable work/rest ratio, typically 30-60 seconds of work against 15-30 seconds of rest — the ratio you pick should match your goal: a 1:1 ratio (equal work and rest) favors endurance, a 2:1 ratio favors conditioning, and anything beyond 3:1 is really only sustainable for advanced athletes. EMOM (Every Minute On the Minute) has you complete a set of reps at the start of each minute and rest for whatever time is left over — the timer fires at every 60-second mark, a format popular in CrossFit and functional training. AMRAP (As Many Rounds As Possible) sets a total time and lets you complete as many circuits as possible within it, with no per-round timer needed — use stopwatch mode to track elapsed time while you run an AMRAP session. Custom intervals let you set any work duration, rest duration, round count, and between-set rest to match a program that doesn't fit the standard formats."
  },
  {
    title: "How to Choose Your Work-Rest Ratio",
    body:
      "Beginners generally do best with a 1:2 ratio — 30 seconds of work against 60 seconds of rest — which allows full recovery between sets. Intermediate exercisers tend toward a 1:1 ratio, such as 30/30 or 40/40. Advanced and HIIT-focused training pushes to a 2:1 ratio, like 40/20 or 45/15. Tabata itself uses a 2:1 ratio at maximum intensity, and it's only sustainable precisely because the total duration is so short. A useful rule of thumb: if you can still talk in full sentences during your work intervals, either increase the intensity or cut the rest time down. Rest is not optional — inadequate rest between intervals reduces both the quality and the safety of the sets that follow it."
  },
];

const faqs = [
  {
    question: "How do I set up a workout timer?",
    answer:
      "Select your workout mode from the presets (Tabata, HIIT, EMOM, or Custom), or tap Custom to enter your own work duration, rest duration, and round count. Press Start — the timer counts down through work phases (shown in green) and rest phases (shown in red or amber). Audio alerts fire at each phase transition so you don't need to watch the screen during your workout."
  },
  {
    question: "What are the different modes available in the workout timer?",
    answer:
      "Five modes: Tabata (20/10 × 8 preset), HIIT (custom work/rest ratios), EMOM (every-minute-on-the-minute), Custom (fully configurable work, rest, rounds, and between-set rest), and Stopwatch (free running timer for AMRAP sessions). Each mode shows color-coded phases and remaining rounds so you know exactly where you are in your workout."
  },
  {
    question: "Can I customize the intervals for my workout?",
    answer:
      "Yes. In Custom mode, set work duration from 5 seconds to 10 minutes, rest duration from 5 seconds to 10 minutes, number of rounds from 1 to 99, and optional between-round rest for circuit training. Save your configuration as a named preset for instant access next session."
  },
  {
    question: "Does the workout timer have sound alerts?",
    answer:
      "Yes. Three alert sounds fire at each phase change: a start beep (work phase begins), a warning beep (3 seconds before phase ends), and a rest tone (rest phase begins). Volume is adjustable. Alerts work on mobile with the screen locked if your device allows background audio. An optional countdown voice calls out \"3, 2, 1\" before each phase transition."
  },
  {
    question: "How can I reset the workout timer?",
    answer:
      "Press R or tap the Reset button to return to the first round and reset all counts. Pause with the spacebar or the Pause button — the timer freezes exactly where it stopped and resumes from the same point. Double-tap Reset to clear your current configuration and return to the mode selection screen."
  },
  {
    question: "What types of workouts can I use this timer for?",
    answer:
      "Any timed exercise format: HIIT cardio circuits, Tabata sets, weight training with timed sets, yoga flows, boxing rounds, sprint intervals, rowing ergometer intervals, battle rope exercises, jump rope, and any sport or activity that uses fixed time blocks rather than rep counting. The timer is also used for study sessions, cooking, and any activity requiring structured time intervals."
  },
];

const relatedLinks = [
  { href: "/clocks/pomodoro-timer-online", name: "Pomodoro Timer Online" },
  { href: "/clocks/stopwatch-online", name: "Stopwatch" },
  { href: "/clocks/reaction-time-test", name: "Reaction Time Test" },
];

export default function WorkoutTimerOnlineFreePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <IntervalTimer />
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
