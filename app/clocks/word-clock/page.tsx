import type { Metadata } from "next";
import WordClock from "@/components/clocks/experiences/WordClock";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Word Clock | Time Displayed as Written Words",
  description:
    "Free word clock online. See the current time spelled out in words: \"IT IS QUARTER PAST THREE.\" A beautiful typographic clock display. No signup.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/word-clock",
  },
  openGraph: {
    title: "Word Clock | Time Displayed as Written Words",
    description:
      "Free word clock online. See the current time spelled out in words. A beautiful typographic clock display.",
    url: "https://thegodoftime.com/clocks/word-clock",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Word Clock Online",
  url: "https://thegodoftime.com/clocks/word-clock",
  description:
    "Free word clock online. See the current time spelled out in words, updating every five minutes.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Time spelled out as a written sentence",
    "Updates every 5 minutes",
    "Light and dark display modes",
    "Fullscreen ambient display",
  ],
};

const introText =
  "This word clock online spells out the current time as a sentence — \"IT IS HALF PAST NINE\" — instead of showing it as numbers, which is a different product entirely from a world clock showing multiple cities. A word clock that spells time this way turns the exact minute into a rounded, human phrase, refreshing every five minutes as the wording changes. Interior design enthusiasts, tech aesthetes, gift shoppers researching word clock products, and curious visitors use it as a calmer, more ambient alternative to a numeric display — the kind of word clock app people leave running full screen just to look at.";

const sections = [
  {
    title: "How a Word Clock Displays Time",
    body:
      "A grid of letters covers the face, and at any given moment specific words light up to form a sentence expressing the current time, while the words not part of that phrase stay dimmed. The display only updates every five minutes, since that's the finest resolution natural language phrasing like this can express. A few examples make the pattern clear: 12:00 becomes \"IT IS TWELVE O'CLOCK,\" 12:15 becomes \"IT IS QUARTER PAST TWELVE,\" 12:30 becomes \"IT IS HALF PAST TWELVE,\" and 12:45 becomes \"IT IS QUARTER TO ONE.\" The unused letters surrounding the active phrase aren't wasted — they form a quiet background texture that makes the lit-up words feel discovered rather than simply printed."
  },
  {
    title: "Word Clock vs Analog vs Digital Clock",
    body:
      "A digital clock is precise to the second. An analog clock requires reading hand position and angle. A word clock is deliberately approximate — accurate only to the nearest five minutes — expressed as natural language instead of a number. That trade-off is exactly why word clocks feel warmer and more human than a digital readout: reading a phrase engages differently than reading digits. Word clocks originated as physical products, most notably the popular Qlocktwo brand, well before browser-based versions like this one existed. Their aesthetic has made them popular both as home decor and as an always-on ambient display — the sort of thing left running on a spare laptop or tablet purely for how it looks."
  },
];

const faqs = [
  {
    question: "What is a word clock?",
    answer:
      "A word clock is a clock face that expresses the current time as a written sentence rather than numbers. A grid of letters illuminates specific words to form phrases like \"IT IS QUARTER PAST THREE\" or \"IT IS HALF PAST NINE.\" The display updates every five minutes as the time phrase changes, making it approximate to the nearest five-minute increment."
  },
  {
    question: "How does a word clock work?",
    answer:
      "The clock face contains a grid of all possible time-related words. An algorithm determines which words need to be lit to express the current time as a grammatical sentence in English. Words not part of the current phrase remain dimmed but visible as background texture. The active words transition with a fade animation when the phrase changes each five minutes."
  },
  {
    question: "Can I customise the display of a word clock?",
    answer:
      "Yes. Choose from light mode (dark letters on pale background) and dark mode (lit letters on dark background). Select your accent color for the active words. Switch between 12-hour and 24-hour language formats. Click the fullscreen button for a full-screen word clock display suitable as a desktop background or ambient display."
  },
  {
    question: "How do I use a word clock to manage time zones?",
    answer:
      "The word clock displays your local device time and updates automatically when you travel. For multiple time zones side by side, use the World Clock tool which shows current times across multiple cities simultaneously — a different tool from this word clock display."
  },
  {
    question: "Is there a word clock app for mobile devices?",
    answer:
      "The web version works on any mobile browser and is fully responsive. Add it to your home screen as a PWA for app-like access on iOS or Android. For a dedicated native app, search for \"word clock\" in the App Store or Google Play — several paid physical clock brands (like Qlocktwo) have companion apps."
  },
  {
    question: "What are the best features of a word clock?",
    answer:
      "The standout feature is the way it humanises time — reading \"IT IS TWENTY PAST FOUR\" feels different from seeing 4:20. The approximate 5-minute display removes the precision anxiety of digital clocks. Word clocks are particularly popular as always-on ambient displays where precise timekeeping is less important than aesthetic presence."
  },
];

const relatedLinks = [
  { href: "/clocks/binary-clock", name: "Binary Clock" },
  { href: "/clocks/fibonacci-clock", name: "Fibonacci Clock" },
  { href: "/clocks/night-clock-online", name: "Night Clock Online" },
];

export default function WordClockPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <WordClock />
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
