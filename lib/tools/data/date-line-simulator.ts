import { ToolPageData } from "../toolPageData";

export const dateLineSimulatorData: ToolPageData = {
  slug: "date-line-simulator",
  name: "International Date Line Crossing Simulator",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#D8F870",
  description: "Simulate traveling across the Pacific IDL to see date gains or losses in real time.",
  
  seo: {
    title: "International Date Line Crossing Simulator | IDL Travel Simulator",
    metaDescription: "Calculate calendar date adjustments when crossing the Pacific 180° meridian. Learn how eastbound and westbound flights gain or lose days.",
    introText: "The International Date Line Crossing Simulator models the calendar paradoxes encountered by travelers crossing the Pacific meridian. Crossing from east to west or vice versa triggers a calendar adjustment of exactly 24 hours, meaning you either repeat a day or skip a day completely.",
    howToTitle: "How to Simulate IDL Crossings",
    howToSteps: [
      "Select your departure date using the calendar picker.",
      "Choose the crossing direction: Eastbound (Asia to Americas) or Westbound (Americas to Asia).",
      "Set the projected flight or transit duration in hours.",
      "Review the simulation results showing the calculated local arrival date and a detailed summary of the day shift."
    ],
    useCases: [
      {
        title: "Pacific Aviation Flight Plans",
        content: "Determine if passengers traveling from San Francisco to Tokyo will land on standard calendar days."
      },
      {
        title: "Maritime Sailing Itineraries",
        content: "Help cargo shipping crews update ship logbooks correctly when crossing the 180th meridian."
      },
      {
        title: "Sci-Fi Time Travel Visualization",
        content: "Teach students the mathematical concept of chronological boundaries and standard earth coordinate segments."
      }
    ],
    internalLinksText: "To calculate durations for actual flight schedules, use the Flight Duration & Time Zone Calculator. To find coordinates on a world map, try the Time Zone Finder by Map Click.",
    relatedToolSlugs: [
      "flight-duration-calculator",
      "timezone-map-finder",
      "world-time-converter"
    ],
    faqs: [
      {
        question: "Why do you gain a day when traveling Eastbound?",
        answer: "Traveling Eastbound moves you from a ahead timezone (e.g. UTC+12) back to a behind timezone (e.g. UTC-8). Crossing the IDL subtracts a calendar day, allowing you to experience the same date twice."
      },
      {
        question: "Is the International Date Line a straight line?",
        answer: "No. The IDL zigzags around national borders (such as Kiribati and the Aleutian Islands) so that island groups can share the same calendar day as their primary trading partners."
      },
      {
        question: "What happens to a child born on a ship crossing the IDL?",
        answer: "The date of birth recorded in the official ship log depends on the vessel's shipboard timezone at the exact moment of birth."
      }
    ]
  }
};
