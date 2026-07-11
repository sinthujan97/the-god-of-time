import type { Metadata } from "next";
import CpsTester from "@/components/clocks/experiences/CpsTester";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Click Per Second Test | Free CPS Speed Test",
  description:
    "Free click per second test. Click as fast as possible for 5 or 10 seconds and see your CPS score. World record is 14.1 CPS. No signup.",
  alternates: {
    canonical: "/clocks/click-per-second-test",
  },
  openGraph: {
    title: "Click Per Second Test | Free CPS Speed Test",
    description:
      "Free click per second test. Click as fast as possible and see your CPS score. World record is 14.1 CPS.",
    url: "/clocks/click-per-second-test",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Click Per Second Test",
  url: "https://thegodoftime.com/clocks/click-per-second-test",
  description:
    "Free clicks per second (CPS) test with 5, 10, and 30 second trials, plus a mouse double-click hardware diagnostic.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "5, 10, and 30 second CPS trials",
    "Percentile comparison against other testers",
    "Mouse double-click hardware diagnostic",
    "Auto clicker detection",
  ],
};

const introText =
  "This click per second test measures how many times you can click a mouse button within a set time window — 5 or 10 seconds — and turns it into a straightforward CPS score. The average adult scores 6-8 CPS, while competitive gamers average 10-14 CPS, so you'll know within seconds where you land. Minecraft PvP players (where CPS directly affects combat), gamers benchmarking their hardware and technique, and people competing with friends over bragging rights all use this click speed test the same way — click as fast as possible, watch the number climb, and see how it compares.";

const sections = [
  {
    title: "Average and World Record CPS Scores",
    body:
      "By skill level, a casual user typically lands at 4-6 CPS, an average gamer at 6-8 CPS, a competitive gamer at 8-12 CPS, and professional PvP players at 12-14 CPS. The world record holder sits at 14.1 CPS. That record belongs to Dylan Allard, who hit 14.1 CPS in a verified 5-second test — the 10-second record is lower, around 12.8 CPS, because muscle fatigue sets in over the longer window. Technique changes the numbers dramatically: regular clicking averages 6-8 CPS, butterfly clicking reaches 15-25 CPS, jitter clicking hits 12-16 CPS (though it's difficult to sustain), and drag clicking can reach 20-40 CPS since it relies on friction against the mouse button rather than raw finger speed. Worth noting: most competitive servers only allow regular clicking — butterfly, jitter, and drag clicking are frequently banned in-game precisely because they produce scores regular technique can't match."
  },
  {
    title: "How to Improve Your Click Per Second Score",
    body:
      "Mouse hardware genuinely matters here: a gaming mouse with a shorter debounce time (8ms or less) physically enables faster click registration compared to a standard office mouse. Technique matters just as much — keeping your fingers close to the button with minimal lift between clicks significantly reduces your click cycle time. Warming up for 30-60 seconds of moderate clicking before a real attempt reliably improves your peak score. Even the surface you're clicking on plays a role: a hard surface gives better control than clicking with your mouse on a soft mat. For most people, regular clicking tops out around 10-11 CPS — pushing beyond that ceiling requires one of the specialized techniques described above."
  },
];

const faqs = [
  {
    question: "What is a clicks per second test?",
    answer:
      "A clicks per second test measures how quickly you can click a mouse button within a fixed time window, expressed as clicks per second (CPS). You click a target zone as fast as possible for the test duration, then receive your CPS score and a percentile comparison against other users. It is used by gamers to benchmark PvP performance and by hardware enthusiasts to test mouse responsiveness."
  },
  {
    question: "How can I improve my clicks per second score?",
    answer:
      "The most impactful change is mouse hardware: a gaming mouse with low debounce time registers clicks faster than an office mouse. Technique improvements include keeping your index and middle fingers resting lightly on the buttons with minimal travel, and clicking from the fingertip rather than the full finger. Regular practice of 2-3 minute clicking sessions shows measurable improvement within one to two weeks."
  },
  {
    question: "What is the world record for clicks per second?",
    answer:
      "The verified world record for a 5-second CPS test is 14.1 clicks per second. For a 10-second test the record is approximately 12.8 CPS as muscle fatigue reduces performance over longer windows. These records use standard clicking technique under tournament conditions — specialized techniques like drag clicking can produce much higher numbers but are generally not permitted in competitive gaming."
  },
  {
    question: "What is considered a good clicks per second score?",
    answer:
      "6-8 CPS is the average for a casual adult user. Scoring above 10 CPS puts you in the top 10-15% of testers. Competitive Minecraft PvP players typically aim for 10-14 CPS as sustained higher speeds provide a combat advantage in vanilla PvP servers. Above 14 CPS with regular clicking technique is considered elite level."
  },
  {
    question: "Can I use an auto clicker for the test?",
    answer:
      "Auto clickers produce unrealistically high scores (100+ CPS) that are detectable by comparison to known human limits. The test includes basic detection that flags results significantly above the human maximum of approximately 16 CPS with regular technique. Auto clicker scores are not meaningful as a measure of your actual speed and are excluded from any leaderboard or percentile ranking."
  },
  {
    question: "What are the different test durations available?",
    answer:
      "The test supports 5-second, 10-second, and 30-second modes. The 5-second test is most commonly used for CPS benchmarking as it is long enough to show your sustained speed but short enough to avoid significant muscle fatigue. The 30-second test measures your endurance clicking rate as fatigue sets in."
  },
  {
    question: "Can this tool also diagnose mouse hardware problems?",
    answer:
      "Yes. Alongside the CPS test, this tool includes a double-click diagnostic mode that detects mouse switch chatter — a common hardware failure where a single physical click registers as two clicks due to a worn switch. If you notice unexpected double-clicks during normal use, run the diagnostic to confirm whether it's a hardware issue before replacing your mouse."
  },
];

const relatedLinks = [
  { href: "/clocks/reaction-time-test", name: "Reaction Time Test" },
  { href: "/clocks/working-memory-test-online", name: "Working Memory Test Online" },
  { href: "/clocks/timer-game-online", name: "Timer Game Online" },
];

export default function ClickPerSecondTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <CpsTester />
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
