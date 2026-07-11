import type { Metadata } from "next";
import WorldClock from "@/components/clocks/experiences/WorldClock";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "World Clock | Live Time in Every Time Zone",
  description:
    "Free world clock. See the current time in multiple cities simultaneously with business hours, day/night indicators, and DST status. No signup required.",
  alternates: {
    canonical: "https://thegodoftime.com/clocks/world-clock",
  },
  openGraph: {
    title: "World Clock | Live Time in Every Time Zone",
    description:
      "Free world clock. See the current time in multiple cities simultaneously with business hours and day/night indicators.",
    url: "https://thegodoftime.com/clocks/world-clock",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "World Clock",
  url: "https://thegodoftime.com/clocks/world-clock",
  description:
    "Free world clock displaying live time for up to 10 cities at once, with day/night status and a business hours indicator for each.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Up to 10 cities pinned and displayed simultaneously",
    "Business hours and day/night indicators per city",
    "Digital or analog display per city",
    "UTC offset shown for every pinned location",
  ],
};

const introText =
  "This world clock displays live current time for multiple cities simultaneously, with a day/night indicator and business hours status shown for each one. It's built for anyone who needs more than a single time zone converted at a time: remote workers coordinating with international teams, travellers checking the time before calling home, businesses with global offices, and anyone who regularly works across time zones. That multi-city simultaneous view is the core differentiator here — most world clock online tools convert one city at a time, while this one keeps your whole set of cities visible together as a world clock time zone dashboard, with a clean, modern world clock digital display that works whether you want seconds shown or not.";

const sections = [
  {
    title: "How to Use the World Clock",
    body:
      "Type any city name to add it to your world clock display, up to 10 pinned locations at once. Each pinned city shows its UTC offset, day/night status, and business hours indicator alongside the live time, so you can see at a glance whether a city is inside its normal working hours without doing any manual math."
  },
  {
    title: "Understanding Time Zones and UTC Offsets",
    body:
      "UTC (Coordinated Universal Time) is the global time standard, approximately equal to GMT. Offsets are expressed relative to it — UTC+5:30 means 5 hours and 30 minutes ahead of UTC, which is India Standard Time. Half-hour and 45-minute offsets are more common than people expect: India runs UTC+5:30, Nepal UTC+5:45, Iran UTC+3:30, and some Australian states UTC+9:30. Daylight saving time complicates things further, since the US, UK, EU, and Australia all change their clocks on different dates — creating a 2-3 week window most years where the time difference between two cities is temporarily an hour off from what it normally is. Some countries have sidestepped this entirely by staying on permanent summer time or abolishing DST altogether. And China is a notable exception on the other end: despite spanning five natural time zones geographically, the world's most populous country uses a single time zone, UTC+8, nationwide."
  },
];

const faqs = [
  {
    question: "What is a world clock and how does it work?",
    answer:
      "A world clock displays the current time in multiple cities or time zones simultaneously, updating in real time from your device's system clock and the UTC offset for each location. This clock shows up to 10 cities at once, with day/night status and a business hours indicator for each pinned location."
  },
  {
    question: "How do I set up a world clock on my phone?",
    answer:
      "Open the world clock in your mobile browser and add your cities by searching the city name. Tap the pin icon to save your city list. Add the page to your home screen via the share menu for app-like access. On iOS, the native Clock app also has a world clock feature — search for the city name under World Clock in the Clock app."
  },
  {
    question: "How can I convert time zones using a world clock?",
    answer:
      "Add the city you are converting from and the city you are converting to. Read the two times side by side. For more control, use the Meeting Planner tool which shows a visual 24-hour grid for multiple cities simultaneously and highlights the overlapping business hours window."
  },
  {
    question: "What is the difference between local time and GMT?",
    answer:
      "GMT (Greenwich Mean Time) is the time at the Prime Meridian in Greenwich, London, and was historically the international time standard. UTC replaced it for technical purposes and is virtually identical. Your local time is GMT/UTC plus or minus your time zone offset. For example, New York is UTC-5 in winter (GMT-5) and UTC-4 in summer when daylight saving time applies."
  },
  {
    question: "How do I change the display settings on a world clock?",
    answer:
      "Each pinned city can be switched independently between a digital readout and an analog clock face — useful if you want a quick visual glance at some cities and precise digits for others. Time is shown in 24-hour format with seconds for precision, alongside the city's UTC offset and business hours status."
  },
  {
    question: "Can I use a world clock for scheduling meetings across time zones?",
    answer:
      "Yes — add all participants' cities to see their current times simultaneously. For finding the optimal meeting slot, use the World Clock Meeting Planner which shows a colour-coded overlap grid of business hours across all your cities. The meeting planner highlights windows where everyone is in normal working hours."
  },
  {
    question: "What is the significance of Daylight Saving Time on world clocks?",
    answer:
      "DST causes time differences between cities to change temporarily. For example, New York and London are normally 5 hours apart, but during the 2-3 week window when the US has changed clocks but the UK has not, they are only 4 hours apart. Because each pinned city's time and UTC offset are calculated live rather than hardcoded, this world clock automatically reflects each location's current DST status without any manual adjustment on your part."
  },
];

const relatedLinks = [
  { href: "/tools/world-clock-meeting-planner", name: "World Clock Meeting Planner" },
  { href: "/tools/world-time-converter", name: "Time Zone Converter" },
  { href: "/tools/military-time-converter", name: "Military Time Converter" },
];

export default function WorldClockPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <WorldClock />
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
