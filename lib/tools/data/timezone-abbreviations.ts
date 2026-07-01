import { ToolPageData } from "../toolPageData";

export const timezoneAbbreviationsData: ToolPageData = {
  slug: "timezone-abbreviations",
  name: "Time Zone Abbreviation Directory",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#D8F870",
  description: "Look up standard abbreviations like EST, CEST, JST, and AEDT with active offsets.",
  
  seo: {
    title: "Time Zone Abbreviation Directory | Global Code Directory",
    metaDescription: "Look up common timezone abbreviations (EST, GMT, CET, JST). View active standard offsets, daylight saving status, and associated geographic regions.",
    introText: "The Time Zone Abbreviation Directory is a searchable glossary of global time codes. Because codes like 'PST' or 'IST' are widely used in news, calendar invitations, and system configs, this tool maps abbreviations to their official names, UTC offsets, and regions.",
    howToTitle: "How to Look Up Abbreviations",
    howToSteps: [
      "Select an abbreviation code from the directory list.",
      "Read the full formal name (e.g. Central European Summer Time).",
      "Verify the standard UTC/GMT offset and if Daylight Saving rules apply to that code.",
      "Browse the list of countries or states associated with that abbreviation."
    ],
    useCases: [
      {
        title: "Analyzing Email Invites",
        content: "Determine if an invitation scheduled in 'AEDT' matches your local morning or evening."
      },
      {
        title: "News Broadcast Timing",
        content: "Confirm regional broadcast schedules announced in GMT or CET for live sports tournaments."
      },
      {
        title: "Server Config Documentation",
        content: "Verify abbreviation values when configuring server system time locales."
      }
    ],
    internalLinksText: "To find coordinates for specific zones, use the Time Zone Finder by Map Click. To track tactical Zulu time, check the Zulu Time Coordinator.",
    relatedToolSlugs: [
      "timezone-map-finder",
      "zulu-time-coordinator",
      "utc-gmt-offset"
    ],
    faqs: [
      {
        question: "Can multiple locations share the same abbreviation?",
        answer: "Yes. For example, 'IST' can refer to India Standard Time (UTC+5:30), Irish Standard Time (UTC+1), or Israel Standard Time (UTC+2)."
      },
      {
        question: "Is 'GMT' the same as 'UTC'?",
        answer: "GMT is a standard timezone abbreviation. UTC is a time standard used to calculate offsets. For daily schedules, they align exactly."
      },
      {
        question: "Do abbreviations change dynamically?",
        answer: "Yes, many locations change their abbreviations in summer, shifting from PST (Standard) to PDT (Daylight)."
      }
    ]
  }
};
