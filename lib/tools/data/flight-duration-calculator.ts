import { ToolPageData } from "../toolPageData";

export const flightDurationCalculatorData: ToolPageData = {
  slug: "flight-duration-calculator",
  name: "Flight Duration & Time Zone Calculator",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#F5A857",
  description: "Determine exact flight duration using departure/arrival local times and time zone offsets.",
  
  seo: {
    title: "Flight Duration & Time Zone Calculator | Air Travel Duration Planner",
    metaDescription: "Calculate the exact elapsed time of flight routes. Accounts for different departure/arrival time zones, layovers, and Date Line crossings.",
    introText: "The Flight Duration & Time Zone Calculator solves the confusing math of air travel time. By entering the local departure date/time and the local arrival date/time along with their respective time zones, the calculator isolates the absolute minutes of elapsed flight time, highlighting whether the route crosses the International Date Line.",
    howToTitle: "How to Calculate Flight Duration",
    howToSteps: [
      "Enter the local departure date and time as written on your boarding pass.",
      "Select the IANA timezone of the departure airport.",
      "Enter the scheduled local arrival date and time.",
      "Select the arrival airport's timezone. Click Calculate to view total flight hours."
    ],
    useCases: [
      {
        title: "Travel Itinerary Verification",
        content: "Confirm if the elapsed flight duration matches the travel agent's quotes to prevent connection slipups."
      },
      {
        title: "Aircraft Fuel and Range Audits",
        content: "Pilot planning tools to double check estimated time en route (ETE) against FAA fuel requirements."
      },
      {
        title: "In-Flight Work Planning",
        content: "Determine exactly how many hours of laptop battery life you will need for work during cross-border flights."
      }
    ],
    internalLinksText: "To visualize travel across the Pacific Date Line meridian, try the International Date Line Crossing Simulator. To check UTC equivalents, use the UTC/GMT Offset Finder.",
    relatedToolSlugs: [
      "date-line-simulator",
      "utc-gmt-offset",
      "world-time-converter"
    ],
    faqs: [
      {
        question: "How does the International Date Line affect flight durations?",
        answer: "Crossing the date line shifts your calendar by a full day (+24h or -24h). The calculator detects this shift automatically to avoid returning negative or excessive travel hours."
      },
      {
        question: "Does this flight calculator include layovers?",
        answer: "This tool calculates individual leg durations. For multiple flights, calculate each segment separately and add the ground layover times in between."
      },
      {
        question: "Can I use city names directly to find the timezone?",
        answer: "Yes, our dropdown list maps popular hubs to their standard regional IANA timezone structures."
      }
    ]
  }
};
