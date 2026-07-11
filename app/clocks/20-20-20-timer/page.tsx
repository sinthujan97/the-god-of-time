import type { Metadata } from "next";
import MicroBreakStrobe from "@/components/clocks/experiences/MicroBreakStrobe";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "20-20-20 Timer | Free Eye Strain Break Reminder",
  description:
    "Free 20-20-20 timer. Every 20 minutes, a reminder to look 20 feet away for 20 seconds. Reduces digital eye strain. Runs in background. No signup.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/20-20-20-timer",
  },
  openGraph: {
    title: "20-20-20 Timer | Free Eye Strain Break Reminder",
    description:
      "Free 20-20-20 timer. Every 20 minutes, a reminder to look 20 feet away for 20 seconds.",
    url: "https://thegodoftime.com/clocks/20-20-20-timer",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "20-20-20 Timer",
  url: "https://thegodoftime.com/clocks/20-20-20-timer",
  description:
    "Free automatic eye strain break reminder built around the optometrist-recommended 20-20-20 rule, with a fullscreen break screen and background tab support.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Automatic 20-minute interval alerts",
    "Fullscreen break screen with breathing prompt",
    "Runs continuously in a background tab",
    "Works on mobile browsers",
  ],
};

const introText =
  "This 20-20-20 timer automatically reminds you every 20 minutes to look at something 20 feet away for 20 seconds — the optometrist-recommended rule for reducing digital eye strain. It's a straightforward way to put the 20-20-20 rule for eyes into practice without having to remember it yourself: start the 20-20-20 timer online and it keeps running in the background until your next break is due. Developers, writers, students, office workers, and remote workers who spend all day in front of a screen use it the same way — as a standing reminder that fires reliably, not an app they have to think about. Compared to the basic Netlify version of this tool, this timer runs continuously in a background tab, shows a proper fullscreen break screen with a breathing prompt, and works on mobile — you get the full 20-20-20 rule benefits without babysitting a browser tab.";

const sections = [
  {
    title: "What Is the 20-20-20 Rule?",
    body:
      "The 20-20-20 rule is recommended by the American Optometric Association to reduce Computer Vision Syndrome (CVS), a condition that affects an estimated 65-90% of computer workers. The rule itself is three 20s: every 20 minutes of screen time, look at something at least 20 feet away, for at least 20 seconds. Twenty feet matters because at that distance, the eye's focusing muscle — the ciliary muscle — is fully relaxed, effectively the same as looking at infinity for the visual system. Twenty seconds matters because that's the minimum time needed for the ciliary muscle to relax out of its contracted, close-focus state. And twenty minutes matters because research shows eye strain accumulates significantly after roughly 20 minutes of sustained near focus on a screen. Followed consistently, the 20-20-20 rule for eyes helps prevent the core symptoms of CVS: eye fatigue, blurred vision, headaches, dry eyes, and even neck pain that develops from compensating for eye discomfort by leaning toward the screen."
  },
  {
    title: "Tips for Making the 20-20-20 Rule a Habit",
    body:
      "Run this timer in a dedicated background tab rather than relying on remembering it yourself — the whole point of the 20-20-20 rule is that it works passively. When the alert fires, actually look away from every screen, including your phone, which is still a near-distance screen even if it's not the one you were just working on. Use the 20-second break to blink deliberately: the average blink rate drops from about 15 to 5 per minute while staring at a screen, which is a major contributor to dry eye. Pair the break with a shoulder roll and a chin tuck to address the neck strain that builds up from screen posture at the same time. And if you miss a break, don't try to catch up — just let the timer reset and wait for the next 20-minute cycle."
  },
];

const faqs = [
  {
    question: "What is the 20-20-20 timer?",
    answer:
      "The 20-20-20 timer is an automatic break reminder that alerts you every 20 minutes to rest your eyes. When the timer fires, look at something at least 20 feet away for 20 seconds. The timer then resets automatically for the next 20-minute cycle. It runs continuously in your browser tab without requiring any interaction between breaks."
  },
  {
    question: "How does the 20-20-20 rule help with eye strain?",
    answer:
      "When you focus on a screen, your eye's ciliary muscle contracts to maintain near focus. Sustained contraction for more than 20 minutes causes the muscle to fatigue — experienced as blurry vision, headaches, and eye discomfort. Looking at something 20 feet away for 20 seconds fully relaxes this muscle, resetting your eyes for another 20 minutes of comfortable screen use."
  },
  {
    question: "Can I customize the timer intervals?",
    answer:
      "Yes. While the 20-20-20 rule specifies 20-minute intervals, you can adjust the work interval to 15, 25, or 30 minutes to match your workflow. The break duration can also be extended to 30 or 60 seconds. The optometric recommendation is a minimum of 20 seconds of distance viewing — longer breaks provide additional benefit."
  },
  {
    question: "What are the benefits of using a 20-20-20 timer?",
    answer:
      "Regular use reduces the key symptoms of Computer Vision Syndrome: eye fatigue, blurred vision, headaches, dry eyes, and neck pain. Studies show that workers using scheduled screen breaks report significantly lower eye strain at the end of the day compared to those without break reminders. The breaks also provide a natural mental reset that many users report improves sustained focus."
  },
  {
    question: "How do I set a timer for 20 minutes?",
    answer:
      "Click Start — the timer begins immediately with a visible countdown in the tab title so you can monitor it without keeping the tab open. When 20 minutes elapse, an alert appears with a gentle sound and a fullscreen break prompt. Dismiss the break screen and the next 20-minute cycle begins automatically."
  },
  {
    question: "Is there a mobile app for the 20-20-20 rule?",
    answer:
      "This web timer works on any mobile browser without downloading an app. Open it in Safari or Chrome on your phone, add it to your home screen for one-tap access, and enable notifications when prompted for background alerts. Mobile screen use causes the same eye strain as desktop screens and benefits equally from the 20-20-20 rule."
  },
];

const relatedLinks = [
  { href: "/clocks/pomodoro-timer-online", name: "Pomodoro Timer Online" },
  { href: "/clocks/meditation-timer-online", name: "Meditation Timer Online" },
  { href: "/clocks/circadian-rhythm-clock", name: "Circadian Rhythm Clock" },
];

export default function TwentyTwentyTwentyTimerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <MicroBreakStrobe />
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
