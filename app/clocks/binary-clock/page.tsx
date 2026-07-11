import type { Metadata } from "next";
import BinaryClock from "@/components/clocks/experiences/BinaryClock";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Binary Clock Online | Free Live Binary Time Display",
  description:
    "Free binary clock online. Watch the current time displayed in binary format with live updates. Includes a guide on how to read it. No signup.",
  alternates: {
    canonical: "/clocks/binary-clock",
  },
  openGraph: {
    title: "Binary Clock Online | Free Live Binary Time Display",
    description:
      "Free binary clock online. Watch the current time displayed in binary format with live updates.",
    url: "/clocks/binary-clock",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Binary Clock Online",
  url: "https://thegodoftime.com/clocks/binary-clock",
  description:
    "Free binary clock online. Watch the current time displayed in binary format with live updates.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Live binary-coded decimal time display",
    "Real-time updates every second",
    "Customizable dot colors",
    "Fullscreen mode",
  ],
};

const introText =
  "This binary clock online displays the current time using binary number representation — columns of lit and unlit dots representing binary digits for hours, minutes, and seconds. Once you know how to read a binary clock, glancing at a column of dots and instantly seeing 14:22:45 becomes second nature, which is exactly why this binary clock live display doubles as a genuinely useful way to build binary number fluency. Programmers, computer science students, tech enthusiasts, and anyone who wants an unusual desktop clock use it both as a novelty and as daily practice.";

const sections = [
  {
    title: "How to Read a Binary Clock",
    body:
      "The clock has 6 columns arranged as H H : M M : S S — each column represents one decimal digit (0-9) encoded in binary using 4 bits. Read each column from bottom to top: the rows represent the values 1, 2, 4, and 8. A lit dot means that bit is 1; an unlit dot means it's 0 — add up the lit values in a column to get that digit. For example, take the time 14:22:45. The hour 14 splits into two digits: 1 (binary 0001) and 4 (binary 0100). The minute 22 splits into 2 (binary 0010) and 2 (binary 0010). The second 45 splits into 4 (binary 0100) and 5 (binary 0101). As a quick reference for reading any column: 0 = 0000, 1 = 0001, 2 = 0010, 3 = 0011, 4 = 0100, 5 = 0101, 6 = 0110, 7 = 0111, 8 = 1000, 9 = 1001 — once these ten patterns are familiar, reading the whole clock becomes almost instant."
  },
  {
    title: "Binary vs BCD Clock — What's the Difference?",
    body:
      "A true binary clock encodes the entire time value as one single binary number — technically possible, but hard to read at a glance since the bit boundaries between hours, minutes, and seconds aren't visually obvious. A BCD (Binary Coded Decimal) clock instead converts each decimal digit separately into its own 4-bit binary column, which is what nearly every binary clock shown online — including this one — actually implements. BCD is easier to read precisely because each digit only ever needs to represent 0 through 9, meaning a maximum of 4 bits per column regardless of position. A pure binary encoding of the hour (0-23) would need 5 bits and wouldn't map cleanly onto separate tens/units digits, making it considerably harder to parse visually than the BCD approach this clock uses."
  },
];

const faqs = [
  {
    question: "How do I read a binary clock?",
    answer:
      "Most binary clocks use BCD (Binary Coded Decimal) format. Each decimal digit of the time (hour tens, hour units, minute tens, etc.) is displayed as a separate binary column. Read each column from bottom to top — the bottom row represents 1, the next 2, then 4, then 8. Add the values of the lit dots in each column to get that digit."
  },
  {
    question: "What is the difference between binary and decimal time?",
    answer:
      "A binary clock displays standard decimal time (hours, minutes, seconds) using binary number representation. Decimal time (French Revolutionary time) divides the day into 10 hours of 100 decimal minutes each. They are completely different systems — a binary clock is standard time shown in binary format, not an alternative time system."
  },
  {
    question: "Can I customise the colors of the binary clock?",
    answer:
      "Yes. Use the theme selector to choose from preset color combinations or set custom colors for active and inactive dots. High contrast mode is available for accessibility. Your color preference is saved between sessions."
  },
  {
    question: "Is there a mobile version of the binary clock?",
    answer:
      "Yes. The binary clock is fully responsive and works on any mobile browser. On small screens the dot grid scales down while remaining readable. Tap the fullscreen button for an immersive binary clock display on any device."
  },
  {
    question: "How does the binary clock update in real time?",
    answer:
      "The clock updates every second using JavaScript's setInterval function. Each update recalculates the current time from your device's system clock and re-renders the binary dot grid. The transition between seconds is instant for a clean live display."
  },
  {
    question: "What are the benefits of using a binary clock?",
    answer:
      "Beyond novelty, binary clocks are genuinely educational for anyone learning about binary numbers and computer science fundamentals. Regular use builds intuitive binary reading speed — many programmers report being able to read a binary clock at a glance within a few weeks of using it as their daily clock."
  },
];

const relatedLinks = [
  { href: "/clocks/decimal-clock", name: "Decimal Clock" },
  { href: "/clocks/word-clock", name: "Word Clock" },
  { href: "/clocks/hex-color-clock", name: "Hex Color Clock" },
];

export default function BinaryClockPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <BinaryClock />
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
