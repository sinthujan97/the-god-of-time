import type { Metadata } from "next";
import LorenzAttractorClock from "@/components/clocks/experiences/LorenzAttractorClock";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "The Fractal Clock | Interactive Geometry Clock",
  description:
    "Free interactive Fractal Clock. A mesmerizing analog clock where the hands recursively branch out to form a beautiful self-similar tree pattern tracing hours, minutes, and seconds. No signup.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/lorenz-attractor-clock",
  },
  openGraph: {
    title: "The Fractal Clock | Interactive Geometry Clock",
    description:
      "A mesmerizing analog clock where the hands recursively branch out to form a beautiful self-similar tree pattern tracing hours, minutes, and seconds.",
    url: "https://thegodoftime.com/clocks/lorenz-attractor-clock",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "The Fractal Clock",
  url: "https://thegodoftime.com/clocks/lorenz-attractor-clock",
  description:
    "An interactive fractal clock where rotating hands recursively sprout smaller hands, creating a mesmerizing self-similar branching pattern in perpetual motion.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Mesmerizing recursive fractal tree logic",
    "Time-synchronized linear CSS animations",
    "Adjustable complexity and hand size scales",
    "Dynamic color palette options (Nebula, Forest, Rainbow)",
    "Clean ambient display mode with optional digital overlay",
  ],
};

const introText =
  "The Fractal Clock is a meditative visualization of time inspired by the classic epicycle mechanical clocks and mathematical tree fractals. In this ambient display, each clock hand recursively branches into a minute and second hand, which themselves sprout further rotating divisions. The result is a gorgeous, swirling geometric tree in continuous hardware-accelerated motion. By offsetting the starting position of the linear animations in CSS, the entire branching pattern rotates in perfect synchronization with your real-world system clock, creating a mesmerizing pattern that feels both mathematically complex and naturally organic.";

const sections = [
  {
    title: "What Is a Fractal Clock?",
    body:
      "A fractal clock represents time using nested, recursive lines. At its base, the root hour hand rotates on a standard 12-hour period. Positioned at the tip of the hour hand are a minute hand and a second hand, which rotate on 1-hour and 60-second periods relative to their parent hand. At the tip of each of those hands, further hands are sprouted recursively, extending down multiple levels of depth. Because the rotation is cumulative (each child inherits the angle of all its parent hands), the system traces out a complex circular web of joints, demonstrating the concept of self-similarity and epicycles in physics and geometry."
  },
  {
    title: "How It Works Under the Hood",
    body:
      "This implementation is built using standard HTML5 and CSS keyframe animations. It is highly optimized: by computing the exact number of seconds elapsed since 12:00:00 on client load, we apply a negative CSS animation-delay to the entire tree. The browser's native animation engine then runs the rotation formulas at 60fps/120fps with zero JavaScript layout thrashing. You can customize the depth of recursion (Complexity), the scale of the hands (Length), and change color themes to fit your space, making it a perfect digital screensaver or focus timer."
  },
];

const faqs = [
  {
    question: "What is a fractal clock?",
    answer:
      "A fractal clock is a visual representation of time where each clock hand recursively branches into smaller, rotating hands at its tip. This creates a self-similar, tree-like geometric structure that moves in sync with the real time."
  },
  {
    question: "Who created the original web fractal clock?",
    answer:
      "The web version of this clock was famously ported and shared by developer Alec Lownes (cakenggt) on GitHub, inspired by the classic macOS screensaver created by Rob Mayoff."
  },
  {
    question: "How do you read the time on the fractal clock?",
    answer:
      "The primary hour hand originates from the center of the clock. Its children are the main minute and second hands, and each hand continues to branch outwards. Because of the complexity, it reads more as a piece of kinetic art, but you can enable the digital time overlay to view the exact time at a glance."
  },
  {
    question: "Can I customize the colors and complexity?",
    answer:
      "Yes. The controls panel above the clock card allows you to adjust the recursion depth from 3 to 8 layers, change the hand lengths from 5% to 20% of the container size, choose from 5 vibrant color palettes, and toggle the digital clock overlay on or off."
  },
  {
    question: "Does it drain my battery or CPU?",
    answer:
      "No. Unlike canvas or WebGL scripts that run heavy math loops in JavaScript on every frame, this clock uses recursive CSS keyframe animations. The browser delegates these rotations to the GPU, making it extremely lightweight and efficient to run continuously as an ambient screensaver."
  },
];

const relatedLinks = [
  { href: "/clocks/fibonacci-clock", name: "Fibonacci Clock" },
  { href: "/clocks/binary-clock", name: "Binary Clock" },
  { href: "/clocks/decimal-clock", name: "Decimal Clock" },
];

export default function LorenzAttractorClockPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <LorenzAttractorClock />
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
