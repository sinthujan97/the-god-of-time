import type { Metadata } from "next";
import CircadianClock from "@/components/clocks/experiences/CircadianClock";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Circadian Rhythm Clock | Your Body Clock Online",
  description:
    "Free circadian rhythm clock. See where you are in your biological cycle right now. Peak alertness, energy dips, and optimal sleep times. No signup.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/circadian-rhythm-clock",
  },
  openGraph: {
    title: "Circadian Rhythm Clock | Your Body Clock Online",
    description:
      "Free circadian rhythm clock. See where you are in your biological cycle right now. Peak alertness, energy dips, and optimal sleep times.",
    url: "https://thegodoftime.com/clocks/circadian-rhythm-clock",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Circadian Rhythm Clock",
  url: "https://thegodoftime.com/clocks/circadian-rhythm-clock",
  description:
    "Free circadian rhythm clock. See where you are in your biological cycle right now — peak alertness, energy dips, and optimal sleep times.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time circadian phase tracking",
    "Cortisol, alertness, and melatonin timeline",
    "Chronotype-adjusted sleep window",
    "Shift worker schedule support",
  ],
};

const introText =
  "This circadian rhythm clock shows where you are in your 24-hour biological cycle right now — cortisol peaks, alertness windows, energy dips, and optimal sleep times based on circadian science. Rather than guessing why you feel sharp at 9am and foggy at 3pm, this biological clock maps the current moment against well-established chronotype and sleep cycle research so you can see exactly what your body is biologically primed to do. Productivity optimizers, shift workers, people with sleep issues, health enthusiasts, and biohackers use it to work with their circadian rhythm in humans instead of fighting it.";

const sections = [
  {
    title: "Your Circadian Rhythm Throughout the Day",
    body:
      "A typical circadian rhythm follows a well-documented sequence of biological events. At 6:00 AM, a cortisol surge acts as the natural wake signal. At 7:00 AM, the immune system gets a boost as T-cells peak. By 9:00 AM, alertness peaks — the best window for hard cognitive tasks. At 10:00 AM, short-term memory hits its daily peak. At 2:30 PM, coordination and reaction time are at their best. At 3:30 PM, reaction speed is the fastest of the day. By 5:00 PM, cardiovascular function peaks, making it the best time to exercise. At 7:00 PM, body temperature reaches its daily high. At 9:00 PM, melatonin begins rising, signaling it's time to start winding down. At 11:00 PM, the optimal sleep window begins for most adults. And at 2:00 AM, sleep is at its deepest and body temperature is at its lowest point of the entire cycle."
  },
  {
    title: "How to Improve Your Circadian Rhythm",
    body:
      "Morning light exposure within 30 minutes of waking is the single most important factor in anchoring a healthy circadian rhythm — it sets the cortisol surge that drives your entire 24-hour cycle. A consistent wake time every day, including weekends, matters more than a consistent bedtime for keeping your rhythm stable. Avoid bright light after 9pm, since it suppresses the natural rise of melatonin your body needs to prepare for sleep. Exercise timing matters too: morning exercise supports alertness, afternoon exercise supports peak performance, but exercising within 2 hours of sleep can delay it. Finally, cut caffeine 8-10 hours before your intended sleep time, since its stimulant effects can linger far longer than most people expect."
  },
];

const faqs = [
  {
    question: "What is a circadian rhythm clock and how does it work?",
    answer:
      "A circadian rhythm clock shows your position in your body's natural 24-hour biological cycle in real time. It maps the current time against known circadian biology — when cortisol peaks, when alertness is highest, when melatonin rises — to show you what your body is biologically programmed to be doing right now."
  },
  {
    question: "How can I improve my circadian rhythm using this tool?",
    answer:
      "Check the clock to see your current biological phase. If you are trying to work during an alertness trough (typically 2pm-4pm), use that window for creative or physical tasks instead of deep analytical work. Use the optimal sleep window marker to determine your ideal bedtime based on your chronotype and wake time."
  },
  {
    question: "What happens if my circadian rhythm is disrupted?",
    answer:
      "Circadian disruption impairs cognitive performance, immune function, metabolism, and mood. It is associated with increased risk of depression, obesity, diabetes, and cardiovascular disease. Shift workers and frequent travellers experience circadian disruption most severely. Consistent light exposure, meal timing, and sleep schedule are the most effective ways to resynchronize."
  },
  {
    question: "How do I set my circadian rhythm for better sleep?",
    answer:
      "Get bright light exposure (ideally sunlight) within 30 minutes of your intended wake time every day. This anchors your cortisol rhythm which sets your entire 24-hour cycle. Keep a consistent wake time even on weekends. Avoid bright overhead light after 9pm — use lamps and dim screens. Melatonin begins rising naturally around 9pm in most adults."
  },
  {
    question: "Can this clock help with shift work schedules?",
    answer:
      "Yes. Select your chronotype (early bird, normal, or night owl) and your shift schedule to see how your biological peaks and troughs align with your working hours. Shift workers should focus deep work during biological alertness peaks even when those peaks occur at unusual clock times, and prioritize sleep in a completely dark room regardless of the time of day."
  },
  {
    question: "What are common examples of circadian rhythms in humans?",
    answer:
      "Common circadian rhythms include: feeling sleepy in the afternoon (2pm-4pm post-lunch dip), being most alert in late morning, lowest body temperature at 4am-5am, peak physical strength in late afternoon, highest blood pressure in mid-morning, and melatonin secretion beginning in darkness. All of these follow the same approximately 24-hour cycle driven by your suprachiasmatic nucleus."
  },
];

const relatedLinks = [
  { href: "/tools/sleep-calculator", name: "Sleep Calculator" },
  { href: "/clocks/night-clock-online", name: "Night Clock Online" },
  { href: "/tools/caffeine-half-life", name: "Caffeine Half-Life Calculator" },
];

export default function CircadianClockPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <CircadianClock />
      <ClockSEOContent
        introText={introText}
        sections={sections}
        faqs={faqs}
        relatedLinks={relatedLinks}
        accent="#FCD34D"
      />
    </>
  );
}
