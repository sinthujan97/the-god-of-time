import type { Metadata } from "next";
import PomodoroTimer from "@/components/clocks/experiences/PomodoroTimer";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Pomodoro Timer Online | Free With Music & Stats",
  description:
    "Free pomodoro timer online. 25-minute work sessions with breaks, ambient music, daily stats, and session history. No signup. Works on any device.",
  alternates: {
    canonical: "/clocks/pomodoro-timer-online",
  },
  openGraph: {
    title: "Pomodoro Timer Online | Free With Music & Stats",
    description:
      "Free pomodoro timer online. 25-minute work sessions with breaks, ambient music, daily stats, and session history.",
    url: "/clocks/pomodoro-timer-online",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pomodoro Timer Online",
  url: "https://thegodoftime.com/clocks/pomodoro-timer-online",
  description:
    "Free pomodoro timer online with 25-minute work sessions, breaks, ambient music, and daily stats.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "25-minute work sessions with 5-minute breaks",
    "Automatic 15-minute long break every 4 sessions",
    "Ambient background music (brown noise, rain, lo-fi)",
    "Daily stats and session history",
  ],
};

const introText =
  "This pomodoro timer online runs the classic technique's 25-minute work intervals with 5-minute breaks, plus a longer 15-minute rest every four sessions, entirely in your browser with no signup. What sets it apart from the market leaders is built-in ambient music — brown noise, rain, or lo-fi pads that fade in automatically when a work session starts and fade out during breaks, so you don't need a separate tab or app running alongside your timer. Students, remote workers, people with ADHD, and anyone fighting procrastination use this as a customizable pomodoro timer that works full screen on any device, whether the goal is deep focus or just getting started on a task they've been avoiding.";

const sections = [
  {
    title: "How to Use the Pomodoro Timer",
    steps: [
      "Enter a task name (optional) so your session history has context later.",
      "Press Start for your 25-minute work session and stay on task until it ends.",
      "Take your break when the timer alerts you — after 4 completed pomodoros, a 15-minute long break activates automatically instead of the usual 5-minute one."
    ],
  },
  {
    title: "Pomodoro Timer for ADHD — Why It Works",
    body:
      "Short, fixed intervals reduce decision fatigue — there's no ongoing choice about when to stop, just a single 25-minute commitment. An external timer also removes the burden of tracking time yourself, which matters enormously for anyone dealing with time blindness, since the clock does the sensing your brain struggles to do reliably. The break structure prevents hyperfocus burnout by forcing a pause even when you'd otherwise keep pushing through, and the 25-minute limit is short enough that starting even the most resisted task feels manageable — telling yourself \"I'll just do one pomodoro\" is a genuinely effective way past task initiation challenges. Research on ADHD and time management consistently points to externally imposed structure as more effective than internal willpower, which is exactly what a pomodoro timer provides: the structure is outside your head, running independently of how motivated you feel in the moment."
  },
];

const faqs = [
  {
    question: "What is a pomodoro timer and how does it work?",
    answer:
      "The pomodoro timer splits your work into 25-minute focused sessions (pomodoros) separated by 5-minute breaks. After four pomodoros, you take a longer 15-minute break. The technique was developed by Francesco Cirillo in the 1980s and named after the tomato-shaped kitchen timer he used as a student."
  },
  {
    question: "How do I customize the timer intervals?",
    answer:
      "Click the Settings gear to adjust work duration (default 25 minutes), short break duration (default 5 minutes), long break duration (default 15 minutes), and the number of pomodoros before a long break (default 4). Changes apply to the current and all future sessions immediately."
  },
  {
    question: "Can I use the pomodoro timer with background music?",
    answer:
      "Yes. Open the Audio panel to select ambient background sound: brown noise for deep focus, rain sounds for calm concentration, lo-fi pad music for creative work, or silence. The audio fades in when a work session starts and fades out during breaks automatically."
  },
  {
    question: "What are the benefits of using a pomodoro timer?",
    answer:
      "The pomodoro technique improves focus by creating urgency within a fixed time window, reduces mental fatigue by enforcing regular breaks, helps track how long tasks actually take, and makes large overwhelming projects more approachable by breaking them into small timed units. Regular users report reduced procrastination and improved daily task completion."
  },
  {
    question: "How do I integrate a pomodoro timer with my to-do list?",
    answer:
      "Type your task name in the task field before starting a pomodoro. Completed sessions are logged with the task name, start time, and duration in the session history. You can view today's completed pomodoro count and total focus time in the daily stats panel below the timer."
  },
  {
    question: "What are some tips for maximizing productivity with a pomodoro timer?",
    answer:
      "Choose only one task per pomodoro — multitasking defeats the purpose. If a task takes longer than one session, mark it and continue in the next pomodoro. Keep a paper notebook nearby for stray thoughts that arise mid-session rather than switching windows. Track your daily pomodoro count to build a streak — most users improve focus capacity significantly within two weeks."
  },
];

const relatedLinks = [
  { href: "/clocks/meditation-timer-online", name: "Meditation Timer Online" },
  { href: "/clocks/time-blindness-test-online-free", name: "Time Blindness Test" },
  { href: "/clocks/workout-timer-online-free", name: "Workout Timer Online Free" },
];

export default function PomodoroTimerOnlinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <PomodoroTimer />
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
