import type { Metadata } from "next";
import RandomTimer from "@/components/clocks/experiences/RandomTimer";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Timer Game Online | Stop the Hidden Timer Game",
  description:
    "Free timer game online. A hidden countdown runs secretly — stop it exactly at zero. Tests your internal sense of time. Free, instant, no signup.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/timer-game-online",
  },
  openGraph: {
    title: "Timer Game Online | Stop the Hidden Timer Game",
    description:
      "Free timer game online. A hidden countdown runs secretly — stop it exactly at zero. Tests your internal sense of time.",
    url: "https://thegodoftime.com/clocks/timer-game-online",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Timer Game Online",
  url: "https://thegodoftime.com/clocks/timer-game-online",
  description:
    "Free timer game online. A hidden countdown runs secretly — stop it exactly at zero to test your internal sense of time.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Hidden random countdown timer",
    "Easy, medium, and hard difficulty ranges",
    "Custom difficulty range support",
    "Session high score tracking",
  ],
};

const introText =
  "This timer game online hides a random countdown and challenges you to stop it at exactly zero — testing how accurately you sense time passing without any visible clock to rely on. Unlike a standard countdown timer game where you watch the numbers fall, this one strips away the visual feedback entirely, so your result reflects genuine internal timing rather than reading a display. People curious about their time perception, the ADHD community, gamers, teachers running a classroom activity, and competitive players chasing their high score all come back to this time perception game to beat their previous best.";

const sections = [
  {
    title: "How to Play the Timer Game",
    steps: [
      "Set your difficulty range: Easy (10-30 seconds), Medium (30-60 seconds), or Hard (60-120 seconds).",
      "Press Start — a secret random timer begins within your chosen range, hidden from view.",
      "Press Stop when you think the timer has reached zero, then see how close you were. The closer to zero, the better your score."
    ],
  },
  {
    title: "Can You Train Your Sense of Time?",
    body:
      "Research shows time perception is trainable, not fixed. Regular practice with timing tasks like this one measurably improves accuracy over 4-6 weeks of consistent play. Musicians and athletes tend to show superior time perception, a byproduct of years of practice requiring precise internal timing. Meditation has also been shown to improve time awareness, likely through the same attentional mechanisms that improve focus generally. Physiological and psychological states shift your perceived time too: caffeine and stress tend to speed up perceived time, making intervals feel shorter than they are, while boredom slows perceived time down and deep engagement speeds it up — which is why an engrossing task can make hours feel like minutes."
  },
];

const faqs = [
  {
    question: "What is a timer game?",
    answer:
      "A timer game challenges you to stop a hidden countdown at exactly the right moment based purely on your internal sense of time. Unlike regular timers, you cannot see the clock — you must feel when the time has elapsed. This tests and trains your time perception, which varies significantly between individuals and can be improved with practice."
  },
  {
    question: "How do I set a timer for my game?",
    answer:
      "Select your difficulty level before starting: Easy runs a random timer between 10 and 30 seconds, Medium between 30 and 60 seconds, and Hard between 60 and 120 seconds. The exact duration within your chosen range is random and hidden. Press Start to begin, then press Stop when you feel the timer has reached zero."
  },
  {
    question: "Can I customize the timer settings?",
    answer:
      "Yes. Set your own minimum and maximum range using the custom difficulty option. For classroom use, narrow the range to make it more predictable. For competitive play, use the Hard or Custom range for maximum challenge. Your session high score tracks your closest result across multiple attempts."
  },
  {
    question: "What are the best timer games for adults?",
    answer:
      "Adults tend to enjoy timer games that test time perception accuracy, reaction speed, or precision stopping. This game's hidden timer mechanic makes it specifically interesting because it reveals your natural time sense without any counting tricks. The Reaction Time Test and Time Blindness Test on this site offer complementary challenges to this game."
  },
  {
    question: "How can I improve my timing accuracy in games?",
    answer:
      "Practise regularly — time perception improves with training. Try to stop the timer without counting seconds in your head. Focus on the feeling of elapsed time rather than estimating it mathematically. Compare your results across sessions to track improvement. People who meditate regularly tend to have better time accuracy."
  },
  {
    question: "Are there multiplayer timer games available?",
    answer:
      "Multiplayer mode is on the roadmap. Currently the game tracks your personal session scores so you can compare attempts. Share your result score on social media to challenge friends. The Time Blindness Test also works as a group comparison — everyone takes the same test and compares their accuracy scores."
  },
];

const relatedLinks = [
  { href: "/clocks/time-blindness-test-online-free", name: "Time Blindness Test" },
  { href: "/clocks/reaction-time-test", name: "Reaction Time Test" },
  { href: "/clocks/countdown", name: "Countdown Timer" },
];

export default function RandomTimerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <RandomTimer />
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
