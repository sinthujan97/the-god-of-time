import { ToolPageData } from "../toolPageData";

export const dstTrackerData: ToolPageData = {
  slug: "dst-tracker",
  name: "Daylight Saving Time Transition Tracker",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#F5A857",
  description: "See upcoming DST clock shift dates and countdowns across various global locations.",
  
  seo: {
    title: "Daylight Saving Time Transition Tracker | DST Schedule Planner",
    metaDescription: "Calculate when daylight saving shifts occur for any IANA location. Includes a ticking transition countdown and offset transition details.",
    introText: "The Daylight Saving Time Transition Tracker calculates the exact moment a specific region shifts its clocks (either forward or backward). It provides a countdown of days, hours, and minutes to help travelers, developers, and event planners prepare for the sudden shift in local business hours.",
    howToTitle: "How to Track DST Transitions",
    howToSteps: [
      "Select your local or target timezone from the global dropdown selection.",
      "Input a reference date or use today's date.",
      "Examine the results card to see if that timezone implements a DST system.",
      "Review the active countdown clock showing the time remaining until the next transition event."
    ],
    useCases: [
      {
        title: "International Shift Adjustments",
        content: "Anticipate the 1-hour overlap loss in team schedules when London switches back before New York."
      },
      {
        title: "Cron and Server Task Auditing",
        content: "Plan server maintenance or recurring jobs to prevent double-executions or missed scripts during the 2:00 AM clock fallback."
      },
      {
        title: "Travel Schedule Coordination",
        content: "Confirm if local train or flight schedules will change overnight during your stay in seasonal regions."
      }
    ],
    internalLinksText: "To convert coordinates to zones, use the Time Zone Finder by Map Click. To sync Swiss-inspired decimal times, check the Internet Time Converter.",
    relatedToolSlugs: [
      "timezone-map-finder",
      "internet-time-converter",
      "world-time-converter"
    ],
    faqs: [
      {
        question: "Why do countries transition on different dates?",
        answer: "DST schedules are regulated by local governments. For example, the United States transitions on the second Sunday of March, while the European Union transitions on the last Sunday of March."
      },
      {
        question: "Which major regions do not use Daylight Saving Time?",
        answer: "Most of Asia, Africa, and parts of South America (including Japan, India, China, and Brazil) run on standard time year-round."
      },
      {
        question: "What is the standard name of the offset after transition?",
        answer: "When transitioning forward in spring, zones change from Standard Time (e.g. EST) to Daylight Time (e.g. EDT)."
      }
    ]
  }
};
