import type { Metadata } from "next";
import NightClock from "@/components/clocks/experiences/NightClock";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Night Clock Online | Dark Bedside Clock Free",
  description:
    "Free night clock online. A minimal dark bedside clock that auto-dims after 30 seconds. Fullscreen mode. Perfect for sleeping with. No signup.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/night-clock-online",
  },
  openGraph: {
    title: "Night Clock Online | Dark Bedside Clock Free",
    description:
      "Free night clock online. A minimal dark bedside clock that auto-dims after 30 seconds. Fullscreen mode.",
    url: "https://thegodoftime.com/clocks/night-clock-online",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Night Clock Online",
  url: "https://thegodoftime.com/clocks/night-clock-online",
  description:
    "Free night clock online. A minimal dark bedside clock that auto-dims after 30 seconds of inactivity.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Auto-dimming display after 30 seconds",
    "Touch to brighten",
    "12h/24h format toggle",
    "Fullscreen bedside display mode",
  ],
};

const introText =
  "This night clock online is a minimal dark-mode clock designed to stay open all night as a bedside display, auto-dimming after 30 seconds of inactivity so it never lights up the room while you sleep. It's the best night clock option for anyone who wants a digital clock night mode without buying a dedicated device — just a full screen clock running in your browser. People who want to turn a phone or tablet into a bedside clock, light sleepers who need minimal screen brightness, and parents checking the time at night without waking anyone all use it in place of a physical clock.";

const sections = [
  {
    title: "How to Use the Night Clock as a Bedside Display",
    steps: [
      "Open the night clock on your phone, tablet, or computer.",
      "Press F or tap the fullscreen button, then set your preferred brightness level.",
      "Place the device on your bedside table — the clock automatically dims after 30 seconds of no interaction, and a single touch restores full brightness."
    ],
  },
  {
    title: "Night Clock Features for Better Sleep",
    body:
      "Auto-dim reduces brightness after 30 seconds specifically to avoid disturbing sleep, so the display never stays glaring in a dark room. A single touch-to-brighten gesture restores full brightness instantly for a quick time check without fumbling for a lamp. The design is deliberately minimal — no ads, no notifications, nothing competing for attention when all you want is the time. A 12h/24h toggle lets you choose your preferred display format, and an optional date display means you can check the date without unlocking your phone and triggering a flood of notifications. Because the clock only renders a simple display rather than running a full app, it is also meaningfully more battery-friendly than leaving a phone's home screen or a heavier app open overnight."
  },
];

const faqs = [
  {
    question: "What is a night clock and how does it work?",
    answer:
      "A night clock is a minimal, dark-mode clock designed to be left open on a phone, tablet, or computer as a bedside display. This clock automatically dims its brightness after 30 seconds of no interaction to avoid lighting up the room at night. Touch or click anywhere to restore brightness for a quick time check."
  },
  {
    question: "How can I customize the night mode on my clock?",
    answer:
      "Use the brightness slider to set your preferred display intensity before going to sleep. Toggle between 12-hour and 24-hour format in settings. Show or hide the date display. Enable or disable the auto-dim feature if you prefer a constant brightness. All settings persist between sessions."
  },
  {
    question: "What are the benefits of using a night clock for sleep?",
    answer:
      "A dedicated night clock eliminates the habit of picking up your phone to check the time which exposes you to notifications and blue light. The auto-dim feature keeps the room dark enough for sleep while still allowing you to check the time without turning on a light or unlocking your phone."
  },
  {
    question: "Can I use the night clock on my mobile device?",
    answer:
      "Yes. Open the night clock in your mobile browser and tap the fullscreen button. The clock works on any iOS or Android device in any mobile browser. For the best experience, enable \"Keep screen on\" in your device settings or browser while the clock is open. The auto-dim feature reduces battery drain during extended use."
  },
  {
    question: "What features should I look for in a night clock for kids?",
    answer:
      "For children's rooms, look for: a very low maximum brightness to avoid sleep disruption, a simple large-digit display readable from a distance, no distracting animations or colours that might stimulate rather than soothe, and a stable always-on display that works without touching the device. This clock meets all those requirements."
  },
  {
    question: "How does a night clock differ from a traditional clock?",
    answer:
      "A traditional bedside clock is a physical device. This online night clock turns any screen into a bedside clock with features physical clocks lack: auto-dimming, adjustable brightness, no batteries to replace, customizable display format, and the ability to show additional information like the date or current conditions."
  },
];

const relatedLinks = [
  { href: "/clocks/circadian-rhythm-clock", name: "Circadian Rhythm Clock" },
  { href: "/clocks/moon-phase-clock-online", name: "Moon Phase Clock Online" },
  { href: "/tools/sleep-calculator", name: "Sleep Calculator" },
];

export default function NightClockPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <NightClock />
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
