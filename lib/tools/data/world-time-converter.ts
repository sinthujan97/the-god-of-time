import { ToolPageData } from "../toolPageData";

export const worldTimeConverterData: ToolPageData = {
  slug: "world-time-converter",
  name: "World Time Zone Converter",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#D8F870",
  description: "Convert any local time into multiple targeted global time zones simultaneously.",
  
  seo: {
    title: "World Time Zone Converter | Multi-Zone Time Planner",
    metaDescription: "Convert a custom time in one city to multiple global destinations simultaneously. Drag, drop, and compare international meeting times instantly.",
    introText: "The World Time Zone Converter allows you to select a base date, time, and timezone and instantly project that moment across a list of target cities. It is designed for remote teams, travelers, and international organizers who need to coordinate across dynamic Daylight Saving Time changes.",
    howToTitle: "How to Convert World Times",
    howToSteps: [
      "Select your source date and time using the datepicker and input fields.",
      "Choose the source timezone from the dropdown.",
      "Add target timezones to the conversion list below. Use the search to find cities or zones.",
      "Observe the relative day indicators (+1 Day, -1 Day) and the local offset differentials immediately."
    ],
    useCases: [
      {
        title: "Global Webinar Planning",
        content: "Find the optimal window to launch a webinar that works for audiences in New York, London, and Tokyo simultaneously."
      },
      {
        title: "Aviation and Flight Check",
        content: "Convert local departure times to your destination zone to anticipate jet lag and schedule hotel arrivals."
      },
      {
        title: "International Broadcasts",
        content: "Coordinate live broadcast times with international syndication partners to avoid airtime scheduling slip-ups."
      }
    ],
    internalLinksText: "To highlight optimal overlapping slots for teams, use the World Clock Meeting Planner. To locate general offset definitions, check the UTC/GMT Offset Finder.",
    relatedToolSlugs: [
      "world-clock-meeting-planner",
      "utc-gmt-offset",
      "multi-city-clock"
    ],
    faqs: [
      {
        question: "Does this tool automatically factor in Daylight Saving Time?",
        answer: "Yes. All calculations utilize native IANA timezone databases built into modern browsers, dynamically adjusting for seasonal DST transitions."
      },
      {
        question: "Can I convert times across past or future dates?",
        answer: "Yes, you can select any year, and the historical or future offset schedules rules for that period will be applied."
      },
      {
        question: "How many time zones can I compare at once?",
        answer: "You can add up to 10 target time zones in a single conversion table to view them side-by-side."
      }
    ]
  }
};
