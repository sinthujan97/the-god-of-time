import type { Metadata } from "next";
import IntervalSounds from "@/components/clocks/experiences/IntervalSounds";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Meditation Timer Online | Free With Bells & Gong",
  description:
    "Free meditation timer online. Set custom intervals with gentle bell chimes at the start, middle, and end of your session. No app, no signup needed.",
  alternates: {
    canonical: "/clocks/meditation-timer-online",
  },
  openGraph: {
    title: "Meditation Timer Online | Free With Bells & Gong",
    description:
      "Free meditation timer online. Set custom intervals with gentle bell chimes at the start, middle, and end of your session.",
    url: "/clocks/meditation-timer-online",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Meditation Timer Online",
  url: "https://thegodoftime.com/clocks/meditation-timer-online",
  description:
    "Free meditation timer online with gentle bell chimes at custom intervals. No app, no signup required.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Custom session duration from 5 to 60 minutes",
    "Singing bowl, gong, and chime bell sounds",
    "Custom interval bells within a session",
    "Distraction-free, no signup required",
  ],
};

const introText =
  "This meditation timer online gives you a distraction-free timer with gentle bell chimes at custom intervals — no app to download, no account to create, and no wait before your session starts. Open the page and you're meditating within seconds, which is the real edge this free meditation timer has over app-based options like Insight Timer that gate the basics behind a signup screen. Beginners starting a practice, experienced meditators who want to leave their phone in another room, yoga teachers timing a class, and mindfulness practitioners who just want a meditation clock online without the friction all use it the same way: set a duration, pick a bell, and close their eyes.";

const sections = [
  {
    title: "How to Use the Meditation Timer",
    steps: [
      "Set your session duration, anywhere from 5 to 60 minutes.",
      "Choose your bell sound — Tibetan singing bowl, brass gong, or a soft chime.",
      "Press Start and close your eyes. Interval bells ring at whatever custom points you configure (for example every 10 minutes), so you never need to check the time yourself."
    ],
  },
  {
    title: "Why Use a Timer for Meditation?",
    body:
      "The single biggest barrier for beginners is the urge to check the time mid-session — every glance at a clock pulls attention straight back out of the practice. A dedicated timer removes that temptation entirely: you set it once and trust it completely. Interval bells solve a related problem, gently guiding you back to focus at a known point without ever breaking the session the way a phone notification would. Consistent session lengths also build a meditation habit faster than the vague \"meditate until it feels right\" approach, since a fixed, repeatable structure is what turns an occasional session into a daily practice. And because a dedicated web timer isn't your phone's lock screen, there's no incoming text or app badge competing for your attention the moment the screen lights up."
  },
];

const faqs = [
  {
    question: "What is a meditation timer and how does it work?",
    answer:
      "A meditation timer is a minimalist countdown clock designed for uninterrupted practice. You set your session length, choose a bell sound, and the timer rings gently at the start, at any custom intervals you configure, and again at the end. The entire interface is distraction-free so nothing draws your attention during the session."
  },
  {
    question: "Can I customize the sounds on the meditation timer?",
    answer:
      "Yes. Choose from a Tibetan singing bowl, a brass gong, or a soft chime for your opening and closing bells. Interval bells within the session can use a different lighter sound to distinguish them from the session-ending tone. Volume is adjustable without leaving the timer screen."
  },
  {
    question: "How do I set intervals for my meditation sessions?",
    answer:
      "In the interval settings, enter how frequently you want a reminder bell. For example, a 30-minute session with 10-minute intervals rings at 10, 20, and 30 minutes. This is useful for mantra cycles, breathing pattern shifts, or guiding beginners through different meditation phases."
  },
  {
    question: "Can I use the meditation timer without signing up?",
    answer:
      "Yes — completely free, no account, no email. Open the page and start immediately. This is the key difference from apps like Insight Timer which require registration. Your session settings are remembered in your browser for your next visit."
  },
  {
    question: "What are the benefits of using a timer for meditation?",
    answer:
      "The primary benefit is removing the urge to check the clock, which disrupts concentration. Research suggests that knowing a timer will signal the end of a session reduces anxiety about \"sitting long enough\" — especially for beginners. Interval bells also provide a non-intrusive way to track the passage of time during longer sessions."
  },
  {
    question: "How do I switch between light and dark mode on the meditation timer?",
    answer:
      "Click the moon/sun icon in the top corner to toggle between dark mode (dim amber light on black — ideal for evening sessions) and light mode (white background for daytime use). The timer remembers your preference for future sessions."
  },
];

const relatedLinks = [
  { href: "/clocks/pomodoro-timer-online", name: "Pomodoro Timer" },
  { href: "/clocks/circadian-rhythm-clock", name: "Circadian Rhythm Clock" },
  { href: "/clocks/night-clock-online", name: "Night Clock Online" },
];

export default function MeditationTimerOnlinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <IntervalSounds />
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
