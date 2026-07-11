import type { Metadata } from "next";
import HexColorClock from "@/components/clocks/experiences/HexColorClock";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Hex Color Clock | Every Second Is a Unique Color",
  description:
    "Free hex color clock. The current time is expressed as a hex color code — the background becomes that color every second. No signup needed.",
  alternates: {
    canonical: "/clocks/hex-color-clock",
  },
  openGraph: {
    title: "Hex Color Clock | Every Second Is a Unique Color",
    description:
      "Free hex color clock. The current time is expressed as a hex color code that updates every second.",
    url: "/clocks/hex-color-clock",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Hex Color Clock",
  url: "https://thegodoftime.com/clocks/hex-color-clock",
  description:
    "Free hex color clock. The current time is converted to a hex color code, with the display color changing every second.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Live time-to-hex-color conversion",
    "Automatic text contrast switching",
    "Copyable hex code display",
    "Fullscreen ambient display",
  ],
};

const introText =
  "This hex color clock online converts the current time into a hex color code — hours become the first two digits (red), minutes the middle two (green), seconds the last two (blue) — and the entire background shifts to that color every second. This second will never happen again, and thanks to this color clock online, it briefly has its own unique color to prove it. Designers, developers, color enthusiasts, and anyone who appreciates the concept use this hex color time display as an unusual, quietly hypnotic clock unlike anything a normal digital readout offers.";

const sections = [
  {
    title: "How the Hex Color Clock Works",
    body:
      "The time format HH:MM:SS maps directly onto a hex color code, #RRGGBB, where each pair of digits becomes one color channel. Hours (00-23) become the Red channel (00-FF), minutes (00-59) become the Green channel (00-FF), and seconds (00-59) become the Blue channel (00-FF). Take 14:22:45 as an example: 14 in hex is 0E, 22 in hex is 16, and 45 in hex is 2D, producing the color #0E162D. The result is a genuinely unique color for every single second of the day — 86,400 distinct colors across a full 24-hour cycle. Since some of those combinations land on very dark or very light backgrounds, the display text automatically switches between white and black based on the background's luminance, so the time and hex code stay readable no matter what color the clock lands on."
  },
  {
    title: "The Colors of Time",
    body:
      "Certain times of day produce recognizably characteristic colors once you've watched the clock for a while. Midnight (00:00:00) renders as pure black, #000000. Noon (12:00:00) comes out a very dark red, #0C0000. Early morning around 6:00 AM is barely visible at #060000. An evening time like 18:00:00 produces a dark crimson, #120000. Late evening values like 22:30:45 stay similarly dark. Because most hour, minute, and second values fall in the lower half of the 0-255 range, the overall palette leans heavily toward dark and muted tones throughout the day. The brightest, most vivid colors only show up at times with high minute and second values — anything close to X:59:59 pushes both the green and blue channels toward their maximum, producing the most saturated colors the clock ever displays."
  },
];

const faqs = [
  {
    question: "How do I customise the color themes on the hex color clock?",
    answer:
      "The default mode uses the time directly as a hex color (HH:MM:SS → #RRGGBB). You can also enable inverted mode (255 minus each value for brighter colors), scaled mode (maps time values to the full 0-255 range for more vivid output), and custom blend modes. Choose your preferred mode in the settings panel."
  },
  {
    question: "Can I pause or reset the color clock?",
    answer:
      "The clock runs continuously matching your device's system clock and cannot be paused — it always shows the current time as a color. Each second is unique and unrepeatable. If you want to capture a specific color, click the hex code display to copy the current hex value to your clipboard."
  },
  {
    question: "What formats does the color clock display time in?",
    answer:
      "The main display shows the full-screen background color plus the hex code in large text. The current time is shown in both digital (HH:MM:SS) and hex (#RRGGBB) formats. Toggle 12/24 hour mode using the button in the top corner. The hex value and digital time both update every second."
  },
  {
    question: "How does the color mapping work on the hex color clock?",
    answer:
      "Hours map to the Red channel (00-23 → #00-#FF), minutes map to the Green channel (00-59 → #00-#FF), and seconds map to the Blue channel (00-59 → #00-#FF). Each pair of time digits is converted directly to its two-character hex equivalent and concatenated into the final #RRGGBB color, which becomes the page background instantly."
  },
  {
    question: "Why do most colors from the hex color clock look so dark?",
    answer:
      "Because the maximum values for hours (23), minutes (59), and seconds (59) never reach 255, none of the three color channels ever hits full brightness on its own from the raw time-to-hex mapping. That's why the palette leans dark and muted for most of the day — only moments with high minute and second values (close to X:59:59) push the green and blue channels high enough to produce a noticeably vivid color."
  },
  {
    question: "Is the hex color clock useful for anything besides novelty?",
    answer:
      "Beyond its use as an ambient display, it's a simple, concrete way to see hex color encoding in action — useful for anyone learning how RGB hex codes are constructed from two-digit channel values. Designers and developers sometimes use it as a quick, playful reference for how a given number maps to its hex representation."
  },
];

const relatedLinks = [
  { href: "/clocks/binary-clock", name: "Binary Clock" },
  { href: "/clocks/fibonacci-clock", name: "Fibonacci Clock" },
  { href: "/clocks/decimal-clock", name: "Decimal Clock" },
];

export default function HexColorClockPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <HexColorClock />
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
