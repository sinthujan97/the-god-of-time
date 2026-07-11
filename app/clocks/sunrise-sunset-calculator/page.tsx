import type { Metadata } from "next";
import SunriseSunset from "@/components/clocks/experiences/SunriseSunset";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Sunrise Sunset Calculator | Live Countdown Timer",
  description:
    "Free sunrise and sunset calculator. See today's sunrise, sunset, golden hour, and solar noon for your location. Includes live countdown to next sunrise and sunset. No signup required.",
  alternates: {
    canonical: "/clocks/sunrise-sunset-calculator",
  },
  openGraph: {
    title: "Sunrise Sunset Calculator | Live Countdown Timer",
    description:
      "Free sunrise and sunset calculator. See today's sunrise, sunset, golden hour, and solar noon for your location.",
    url: "/clocks/sunrise-sunset-calculator",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sunrise Sunset Calculator",
  url: "https://thegodoftime.com/clocks/sunrise-sunset-calculator",
  description:
    "Free sunrise and sunset calculator showing golden hour, blue hour, and solar noon for any location, with automatic location detection.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Automatic location detection",
    "Golden hour and blue hour windows",
    "Solar noon calculation",
    "Daylight remaining for the day",
  ],
};

const introText =
  "This sunrise sunset calculator works out the exact sunrise, sunset, golden hour, blue hour, and solar noon for your location the moment you open it. Type your city, or allow location access and it detects your position automatically — no manual coordinate entry needed. Photographers timing golden hour shoots, hikers and runners planning routes that need to finish before dark, gardeners, and anyone simply curious about today's sunrise sunset time all rely on the same numbers this calculator produces. Beyond the sunrise sunset time today, it's built for planning around the day's light: check the countdown to sunset before heading out, or look up the sunrise sunset time in my location for tomorrow to plan an early start.";

const sections = [
  {
    title: "What Is Golden Hour and Why Does It Matter?",
    body:
      "Golden hour is the period just after sunrise and just before sunset when sunlight is warm, soft, and directional — typically 30-60 minutes long depending on season and latitude. Photographers favor it because the low angle of the sun creates long shadows, minimal harsh overhead light, and warm orange-red tones that flatter almost every subject. Blue hour, the period before sunrise and after sunset when the sky turns a deep blue, typically lasts 20-30 minutes and is prized for its own distinct mood. Solar noon is the moment the sun reaches its highest point in the sky — not the same as 12:00 PM in most locations, since time zone boundaries and daylight saving offsets shift the true midpoint of the day. Solar noon matters practically too: maximum UV exposure occurs within about 2 hours either side of it, which is relevant for outdoor workers and anyone monitoring sun exposure. Seasonal variation is significant — at 45° latitude, golden hour can last just 4-7 minutes in summer but stretch past 30 minutes in winter, since the sun's angle of descent changes with the season."
  },
  {
    title: "How to Use the Sunrise Sunset Timer",
    body:
      "Allow location access for automatic detection, or type your city name manually if you'd rather not share your location. The countdown shows the exact minutes and seconds remaining until the next sunrise or sunset. Set a custom alert to notify you 30, 15, or 5 minutes before your chosen event so you don't have to keep checking back. For photography, arrive at least 30 minutes before golden hour begins — the light changes rapidly once it starts and setup time is critical to not missing the best minutes. For running or hiking, treat sunset as a hard deadline for safe trail navigation: set your alert 90 minutes before sunset to make sure you're back before dark."
  },
];

const faqs = [
  {
    question: "How do I set the timer for the next sunrise?",
    answer:
      "Enable location access when prompted, or type your city name. The timer automatically calculates the next sunrise from your location and displays a live countdown in hours, minutes, and seconds. Click the alarm icon to set a browser notification that fires a specified number of minutes before sunrise — useful for planning early photography sessions or morning runs."
  },
  {
    question: "Can I get alerts for sunrise and sunset times?",
    answer:
      "Yes. Click the bell icon next to sunrise or sunset to enable browser notifications. Set your advance warning — 15, 30, or 60 minutes before the event. Notifications work even if the tab is in the background as long as your browser has notification permission granted. On mobile, add the page to your home screen for more reliable background notification delivery."
  },
  {
    question: "What is the accuracy of the sunrise sunset timer?",
    answer:
      "The calculations use the USNO solar position algorithm, which is accurate to within 1-2 minutes for locations between 60°N and 60°S latitude. Near the poles and during polar day or night seasons, the calculations may not apply. The timer accounts for your elevation above sea level if precise coordinates are available, which affects sunrise and sunset times by 1-3 minutes at typical elevations."
  },
  {
    question: "How does the timer update in real time?",
    answer:
      "The countdown updates every second using your device's clock. The sunrise and sunset times themselves are calculated once per day when the page loads or when your location changes. The golden hour and blue hour windows update automatically as the calculations shift with the season."
  },
  {
    question: "What time is sunset today in my area?",
    answer:
      "Enable location access and the timer shows today's exact sunset time for your location immediately. Times shown are in your local time zone with automatic adjustment for daylight saving time changes. For a date other than today, use the date picker to see sunrise and sunset times for any past or future date."
  },
  {
    question: "Is there a mobile version of the sunrise sunset timer?",
    answer:
      "The tool works fully in any mobile browser. Add it to your home screen via the browser's share menu for app-like access. On iOS Safari, tap the Share button and select Add to Home Screen. The display is optimised for portrait mobile layout with large, readable times and a prominent countdown."
  },
];

const relatedLinks = [
  { href: "/clocks/moon-phase-clock-online", name: "Moon Phase Clock Online" },
  { href: "/clocks/circadian-rhythm-clock", name: "Circadian Rhythm Clock" },
  { href: "/clocks/night-clock-online", name: "Night Clock Online" },
];

export default function SunriseSunsetCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <SunriseSunset />
      <ClockSEOContent
        introText={introText}
        sections={sections}
        faqs={faqs}
        relatedLinks={relatedLinks}
        accent="#FB923C"
      />
    </>
  );
}
