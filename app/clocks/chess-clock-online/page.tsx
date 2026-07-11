import type { Metadata } from "next";
import ChessClock from "@/components/clocks/experiences/ChessClock";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Chess Clock Online | Free With Fischer & Bronstein",
  description:
    "Free chess clock online. Fischer increment, Bronstein delay, blitz and classical presets. Two-player timer for chess and debates. No signup required.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/chess-clock-online",
  },
  openGraph: {
    title: "Chess Clock Online | Free With Fischer & Bronstein",
    description:
      "Free chess clock online. Fischer increment, Bronstein delay, blitz and classical presets.",
    url: "https://thegodoftime.com/clocks/chess-clock-online",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Chess Clock Online",
  url: "https://thegodoftime.com/clocks/chess-clock-online",
  description:
    "Free two-player chess clock with Fischer increment, Bronstein delay, and standard tournament time controls.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Fischer increment and Bronstein delay support",
    "Bullet, blitz, rapid, and classical presets",
    "Fully customizable starting time and increment",
    "Two-player turn-based countdown",
  ],
};

const introText =
  "This chess clock online is a two-player countdown timer with Fischer increment, Bronstein delay, and all the standard tournament time controls built in — no signup, no download. That's the exact feature set the old Flash-era chessclock.org handles poorly and generic tools like online-stopwatch.com don't support at all: proper increment and delay modes named after the players who invented them. Chess players without a physical clock, online tournament organizers running over-the-board events, debate teams needing a fair two-player timer, and anyone who just needs to track alternating turns all use this as a free chess clock app that works the same on a laptop at a tournament table as it does on a phone.";

const sections = [
  {
    title: "Chess Clock Time Controls Explained",
    body:
      "Bullet games (1+0 or 2+1) run 1-2 minutes total with no or minimal increment, producing fast, tactical play under extreme time pressure. Blitz (3+2 or 5+0) gives each player 3-5 minutes and is the most popular online format, demanding quick calculation and intuition over deep analysis. Rapid (10+0 or 15+10) runs 10-15 minutes per player, balancing speed with real calculation — a good recommendation for casual players who want more than blitz allows. Classical (90+30 or 120+0) gives 90+ minutes per player for full-depth calculation and is the standard tournament format. Fischer increment adds a fixed number of extra seconds to a player's clock after every move they make, named after Bobby Fischer who invented the format specifically to prevent time scrambles late in a game. Bronstein delay works differently: the clock only starts counting down after a set delay on each move, so those seconds aren't added to your total but also aren't consumed if you move quickly within the delay window."
  },
  {
    title: "Chess Clock for Debate and Other Games",
    body:
      "A two-player countdown clock isn't just for chess. In debate, each speaker gets equal time and the clock switches sides the moment their turn ends, exactly like a chess move. Go (Weiqi) players often prefer longer base time controls with byoyomi periods instead of a simple increment. Scrabble tournaments commonly use 25 minutes per player with no increment at all. Speed card games and any other two-player format that needs strict turn tracking can use custom short time controls the same way a chess game would. The underlying mechanic — one running clock, one paused, switching on a tap — works for any activity structured as alternating turns."
  },
];

const faqs = [
  {
    question: "How does a chess clock work?",
    answer:
      "A chess clock has two timers — one for each player. When you make a move, you press your side of the clock to stop your timer and start your opponent's. Your clock only counts down during your turn. If your timer reaches zero, you lose on time regardless of the position on the board."
  },
  {
    question: "What are the different timing modes available?",
    answer:
      "This clock supports five modes: Sudden death (fixed time, no increment), Fischer increment (seconds added after each move), Bronstein delay (count starts after a delay per move), Simple delay (similar to Bronstein but clock pauses then continues), and Hourglass (time you use transfers to your opponent)."
  },
  {
    question: "How can I customize my chess clock settings?",
    answer:
      "Set any starting time from 30 seconds to 2 hours per player. Add increment in 1-second increments from 0 to 60 seconds. Enable or disable move counting. Choose from preset time controls for bullet, blitz, rapid, or classical formats, or set completely custom values. Settings save for your next session."
  },
  {
    question: "What is the best chess clock for tournaments?",
    answer:
      "For FIDE-rated tournaments, the standard time control is 90 minutes + 30-second Fischer increment from move 1. For casual club play, 15+10 or 10+5 are most common. For online blitz, 3+2 is standard. Use the preset selector to load these instantly without manual entry."
  },
  {
    question: "How do I pause and reset my chess clock?",
    answer:
      "Press the Pause button (or spacebar) to freeze both clocks simultaneously — useful for interruptions during a game. Press Reset to return both clocks to the starting time. The reset confirmation prevents accidental resets during active games."
  },
  {
    question: "Are there any free chess clock apps available?",
    answer:
      "Yes — this is a completely free browser-based chess clock with no download and no signup. On mobile, add it to your home screen for app-like access. The large touch targets make it usable on phone screens during real over-the-board games where a physical clock is unavailable."
  },
];

const relatedLinks = [
  { href: "/clocks/countdown-timer-online", name: "Countdown Timer" },
  { href: "/clocks/reaction-time-test", name: "Reaction Time Test" },
  { href: "/clocks/stopwatch-online", name: "Stopwatch" },
];

export default function ChessClockOnlinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <ChessClock />
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
