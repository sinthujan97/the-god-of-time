import type { Metadata } from "next";
import FibonacciClock from "@/components/clocks/experiences/FibonacciClock";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Fibonacci Clock Online | Free Interactive Display",
  description:
    "Free Fibonacci clock online. See the current time displayed using colored Fibonacci squares. Includes a guide on how to read it. No signup required.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/fibonacci-clock",
  },
  openGraph: {
    title: "Fibonacci Clock Online | Free Interactive Display",
    description:
      "Free Fibonacci clock online. See the current time displayed using colored Fibonacci squares.",
    url: "https://thegodoftime.com/clocks/fibonacci-clock",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fibonacci Clock Online",
  url: "https://thegodoftime.com/clocks/fibonacci-clock",
  description:
    "Free Fibonacci clock online. See the current time displayed using colored Fibonacci squares, updating live.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Live Fibonacci-sequence time encoding",
    "Color-coded hour, minute, and combined squares",
    "Colorblind-friendly display modes",
    "Fullscreen mode",
  ],
};

const introText =
  "This Fibonacci clock online uses five squares sized 1, 1, 2, 3, and 5 — the first five Fibonacci numbers — colored red, green, blue, or white to encode the current hour and minute. Learning how to read a Fibonacci clock takes a couple of minutes, but once it clicks, decoding the little colored puzzle becomes genuinely satisfying, which is exactly what makes a fibonacci sequence clock such a popular novelty among people who enjoy math for its own sake. Mathematics enthusiasts, designers, programmers who already know the Fibonacci sequence, and people who saw one somewhere and want to finally understand it all use this page to work out the logic in real time.";

const sections = [
  {
    title: "How to Read a Fibonacci Clock",
    body:
      "The clock has 5 squares sized 1, 1, 2, 3, and 5. To read the hour (1-12), add together the sizes of every square colored RED or BLUE. To read the minutes (in steps of 5: 0, 5, 10... up to 60), add together the sizes of every square colored GREEN or BLUE and multiply the total by 5. Blue squares are the trick to the whole system — they count toward BOTH the hour and the minute simultaneously. White squares aren't part of the current time at all. Take the example of 3:25. The hour 3 is made from squares sized 1 and 2, both colored red or blue. The minutes, 25, come from squares sized 3 and 2, both colored green or blue. Since the size-2 square has to serve both totals, it must be colored blue — it's doing double duty, counting as part of both the hour and the minute at once."
  },
  {
    title: "The Mathematics Behind the Fibonacci Clock",
    body:
      "The Fibonacci sequence runs 1, 1, 2, 3, 5, 8 and onward, with each number equal to the sum of the two before it — and the ratio between consecutive terms converges toward the golden ratio, φ ≈ 1.618. The reason this particular clock works at all is that any whole number from 1 to 12 can be built from some subset of {1, 1, 2, 3, 5} — exactly what's needed to represent every possible hour. Minutes work the same way in 5-minute increments: any value from 0 to 12 (representing 0 to 60 minutes in steps of 5) can likewise be built from the same five squares. The Fibonacci clock concept was created by designer Philippe Chrétien in 2013, and its appeal has held up precisely because the math genuinely works — it isn't a decorative approximation, it's a real positional encoding dressed up as color and shape."
  },
];

const faqs = [
  {
    question: "How do I read a Fibonacci clock?",
    answer:
      "Red squares encode hours, green squares encode minutes (×5), and blue squares encode both hours AND minutes simultaneously. White squares are unused. To read the time: add the sizes of all red and blue squares for the hour, add the sizes of all green and blue squares and multiply by 5 for the minutes. The same square can count toward both if it is blue."
  },
  {
    question: "What is the difference between a Fibonacci clock and a standard clock?",
    answer:
      "A standard clock shows time as a direct numerical or positional display. A Fibonacci clock encodes time as a coloured mathematical puzzle — you must perform a small calculation to read the time. This makes it a talking point and a novelty, but deliberately obscures the time compared to a standard clock. It was designed to be more art than utility."
  },
  {
    question: "Can I customise the colors of the Fibonacci clock?",
    answer:
      "Yes. The default colors are red (hours), green (minutes), blue (both), and white (unused). You can select alternative color schemes in settings. Colorblind-friendly modes use patterns or shapes alongside colors to distinguish the squares for users with color vision deficiencies."
  },
  {
    question: "Is there a mobile version of the Fibonacci clock?",
    answer:
      "Yes. The clock is fully responsive and works in any mobile browser. The five Fibonacci squares resize proportionally for smaller screens while remaining visually clear. Tap the fullscreen button for an immersive full-screen display."
  },
  {
    question: "How does the Fibonacci clock work?",
    answer:
      "The clock's algorithm checks the current hour and minute values, then calculates which combination of the five Fibonacci squares (1, 1, 2, 3, and 5) can represent those values. It colors the selected squares red, green, or blue accordingly and updates every 5 minutes when the minute value changes to the next multiple of 5."
  },
  {
    question: "Where can I find an interactive Fibonacci clock online?",
    answer:
      "This is one of the very few interactive Fibonacci clock implementations available online. Most online content about Fibonacci clocks covers physical products (like Etsy clock kits) or Arduino DIY builds. This version updates in real time in your browser with no installation needed."
  },
];

const relatedLinks = [
  { href: "/clocks/binary-clock", name: "Binary Clock" },
  { href: "/clocks/decimal-clock", name: "Decimal Clock" },
  { href: "/clocks/word-clock", name: "Word Clock" },
];

export default function FibonacciClockPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <FibonacciClock />
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
