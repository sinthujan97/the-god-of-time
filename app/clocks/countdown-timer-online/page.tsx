import type { Metadata } from "next";
import CountdownTimer from "@/components/clocks/experiences/CountdownTimer";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Countdown Timer Online | Multiple Timers & Sound",
  description:
    "Free countdown timer online. Run multiple labeled countdowns simultaneously. Fullscreen mode, sound alert, tab title countdown. No signup required.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/countdown-timer-online",
  },
  openGraph: {
    title: "Countdown Timer Online | Multiple Timers & Sound",
    description:
      "Free countdown timer online. Run multiple labeled countdowns simultaneously with a tab title countdown.",
    url: "https://thegodoftime.com/clocks/countdown-timer-online",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Countdown Timer Online",
  url: "https://thegodoftime.com/clocks/countdown-timer-online",
  description:
    "Free countdown timer that runs multiple simultaneous labeled timers, with a completion sound and live browser tab title countdown.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Multiple simultaneous labeled countdown timers",
    "Live tab title countdown",
    "Completion sound alert",
    "Fullscreen mode",
  ],
};

const introText =
  "This countdown timer online tool runs multiple countdowns at once, each with its own custom label and its own start, pause, and reset controls. That's the feature that sets it apart: add a timer for 'Pasta — 12 mins', add another for 'Presentation Q&A — 5 mins', and both count down independently on the same screen. Teachers timing classroom activities, event managers running multiple sessions, cooks timing several dishes at once, and anyone who needs more than one timer running at the same time all reach for this free countdown timer instead of juggling separate tabs. A digital countdown timer with sound plays a completion chime when any timer reaches zero, the active timer's remaining time updates live in the browser tab title so you can track it from another window, and fullscreen mode makes any single countdown easy to read from across a room.";

const sections = [
  {
    title: "How to Use Multiple Countdown Timers",
    body:
      "Enter your first timer's duration and an optional label, like \"Pasta — 12 mins\", then press Start. Add a second timer the same way — it runs independently alongside the first, each with its own start/pause and reset controls. Every active timer counts down on its own clock, and when one reaches zero it plays a completion sound so you know without having to watch the screen. This is the core of how to set a countdown timer for an event with more than one phase: rather than resetting a single timer between segments, keep several running side by side and glance at whichever one you need."
  },
  {
    title: "Countdown Timer Use Cases",
    body:
      "In the kitchen, running two or three dishes with different cooking times at once is much easier with independently labeled timers than switching a single timer back and forth. In a classroom, separate timers per group or per activity phase let each move at its own pace. For events, one timer can count down to the start time while others track individual session lengths running in parallel. For games, multiple player timers or round-specific challenge timers work the same way. In sports training, a rest-period timer and a total workout timer can run side by side. The underlying reason multiple timers matter: switching between separate timer apps or tabs for different tasks causes interruptions that one multi-timer interface avoids entirely."
  },
];

const faqs = [
  {
    question: "How do I use multiple countdown timers at once?",
    answer:
      "Enter a duration and an optional label for your first timer and press Start. Add another timer the same way — each one runs independently with its own Start/Pause and Reset controls, so you can track several countdowns on the same screen without switching tabs or apps."
  },
  {
    question: "Does the countdown timer show in my browser tab title?",
    answer:
      "Yes. The remaining time for your active timer updates live in the browser tab title, so you can monitor the countdown from another tab or window without needing to keep this page in focus."
  },
  {
    question: "Is there a countdown timer with a sound alert?",
    answer:
      "Yes. A completion chime plays automatically when any timer reaches zero, so you don't have to be watching the screen to know a countdown has finished."
  },
  {
    question: "Can I use the countdown timer in fullscreen mode?",
    answer:
      "Yes. Fullscreen mode enlarges the display so a countdown is easy to read from across a room — useful for presentations, classrooms, or propping a device up during a workout."
  },
  {
    question: "How do I label and organize my countdown timers?",
    answer:
      "Type a label before starting a timer — for example, \"Pasta — 12 mins\" or \"Q&A — 5 mins\" — so each countdown is identifiable at a glance once you have more than one running. Remove any timer you no longer need with its close button, and reset a finished timer to reuse it for the same task later."
  },
];

const relatedLinks = [
  { href: "/clocks/presentation-timer-online", name: "Presentation Timer Online" },
  { href: "/clocks/pomodoro-timer-online", name: "Pomodoro Timer Online" },
  { href: "/clocks/workout-timer-online-free", name: "Workout Timer Online Free" },
];

export default function CountdownTimerOnlinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <CountdownTimer />
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
