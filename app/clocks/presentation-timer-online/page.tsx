import type { Metadata } from "next";
import PresentationTimer from "@/components/clocks/experiences/PresentationTimer";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Presentation Timer Online | Free Fullscreen Tool",
  description:
    "Free presentation timer online. Fullscreen speaker timer with color-coded warnings, slide time allocations, and custom presets. No signup needed.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/presentation-timer-online",
  },
  openGraph: {
    title: "Presentation Timer Online | Free Fullscreen Tool",
    description:
      "Free presentation timer online. Fullscreen speaker timer with color-coded warnings and slide time allocations.",
    url: "https://thegodoftime.com/clocks/presentation-timer-online",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Presentation Timer Online",
  url: "https://thegodoftime.com/clocks/presentation-timer-online",
  description:
    "Free fullscreen presentation timer with color-coded warnings, slide time allocation, and custom presets.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Fullscreen large-digit countdown display",
    "Color-coded warnings (green, amber, red)",
    "Per-slide time allocation",
    "Custom duration presets",
  ],
};

const introText =
  "This presentation timer online is a fullscreen countdown for speakers, with a large-digit display, color warnings that shift from green to amber to red, and optional per-slide time allocation. Unlike stagetimer.io, there's no account to create and nothing to configure before you can start — you get the fullscreen display and the no-signup convenience together, which is the gap most free presentation countdown timers don't fill. Conference speakers, teachers, TEDx presenters, debate coaches, and students doing timed class presentations use it as a free presentation timer with sound that just works the moment they open it.";

const sections = [
  {
    title: "How to Use the Presentation Timer",
    steps: [
      "Enter your presentation duration.",
      "Press F for fullscreen on a second display, or open it on your phone to use as a discreet monitor.",
      "Press Start when you begin speaking — the display turns green while you're on track, amber once you've used 75% of your time, and red for the final 2 minutes."
    ],
  },
  {
    title: "Presentation Timer Tips for Speakers",
    body:
      "Place your phone on the podium facing you, not the audience — the timer is for your pacing, not a visual aid for the room. Set the timer for about 2 minutes less than your actual slot, since there's always buffer needed for Q&A or an unexpected overrun. If your talk has clearly defined sections, use per-slide allocation so you can tell early whether you're spending too long on your opening slides before it's too late to recover. Treat the red warning at 2 minutes as your hard signal to move straight to your closing statement, regardless of how much content you still have left — by that point, finishing on time matters more than finishing everything. And run through the full talk with the timer at least once beforehand so your pacing is calibrated before the real presentation, not during it."
  },
];

const faqs = [
  {
    question: "How do I add a timer to my presentation?",
    answer:
      "Open this timer on a separate device (your phone or a tablet) and place it where you can see it but your audience cannot. Alternatively, open it in a second browser window on your laptop and drag it to a secondary monitor. Press fullscreen (F key) for the largest possible display, then start the timer when you begin speaking."
  },
  {
    question: "Can I customize the timer settings?",
    answer:
      "Yes. Set any duration from 1 minute to 4 hours. Enable per-slide time allocation by entering the number of slides and the timer divides your total time equally. Custom presets let you save your most-used durations (5, 10, 15, 20 minutes are pre-loaded). The color warning thresholds (amber and red) are also adjustable."
  },
  {
    question: "Is there a sound option for the timer?",
    answer:
      "Yes. Enable audio warnings to receive a soft chime at 75% elapsed and a louder alert in the final 2 minutes. The end-of-time alarm is a distinct three-tone signal. All sounds can be muted and the visual color changes operate independently of the audio."
  },
  {
    question: "How do I reset the timer during my presentation?",
    answer:
      "Press the R key or click the reset button to return to your full starting duration. Pause with the spacebar or by tapping the screen. The timer state is preserved through accidental navigation — if you change browser tabs and return, the timer resumes exactly where it was."
  },
  {
    question: "What are the best practices for using a presentation timer?",
    answer:
      "Set your timer for 80% of your allocated slot — this leaves room for questions, technical delays, and natural speaking variation. Run through your full presentation with the timer at least once beforehand. Use the amber warning (not the red) as your real signal to accelerate — by the time red appears there is very little room to manoeuvre."
  },
  {
    question: "Are there preset timers for common presentation lengths?",
    answer:
      "Yes. Common presets include 5-minute lightning talk, 10-minute pitch, 15-minute TED-style talk, 20-minute lecture segment, and 45-minute conference session. Click any preset to load it instantly. Custom durations can be saved as your own named presets for future sessions."
  },
];

const relatedLinks = [
  { href: "/clocks/countdown-timer-online", name: "Countdown Timer" },
  { href: "/clocks/meeting-cost-clock-online", name: "Meeting Cost Clock" },
  { href: "/clocks/pomodoro-timer-online", name: "Pomodoro Timer Online" },
];

export default function PresentationTimerOnlinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <PresentationTimer />
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
