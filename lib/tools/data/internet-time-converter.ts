import { ToolPageData } from "../toolPageData";

export const internetTimeConverterData: ToolPageData = {
  slug: "internet-time-converter",
  name: "Internet Time Converter",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#D8F870",
  description: "Convert standard clocks into Swatch Internet Time beats (@000 to @999).",
  
  seo: {
    title: "Internet Time Converter | Swatch Beat Clock Calculator",
    metaDescription: "Convert local time to Swatch Internet Time decimal beats. View BMT (Biel Mean Time) differences and active beat clocks.",
    introText: "The Internet Time Converter calculates Swatch Internet Time, a decimal clock system introduced in 1998 by Swatch. By dividing the 24-hour day into 1000 equal units called 'beats', it eliminates timezone borders, establishing a single global time for the internet.",
    howToTitle: "How to Calculate Internet Time",
    howToSteps: [
      "View the ticking live beat clock showing the current global beat (e.g. @750).",
      "Enter a custom standard hours and minutes setting to translate past or future times.",
      "Check the Biel Mean Time (BMT) standard equivalents, which is UTC+1 hour.",
      "Copy the beat value string to reference on virtual community boards."
    ],
    useCases: [
      {
        title: "Online Gaming Events",
        content: "Schedule raids or tournaments using beats to avoid calculating timezone offsets for international guild members."
      },
      {
        title: "International Chat Rooms",
        content: "Coordinate online forum meetups using a single universal clock standard."
      },
      {
        title: "Retro Technology Exploration",
        content: "Learn about the late-90s decimal time movement and digital currency concepts."
      }
    ],
    internalLinksText: "To synchronize tactical military schedules, use the Zulu Time Coordinator. To track atomic GPS adjustments, check the GPS Time Correction Tool.",
    relatedToolSlugs: [
      "zulu-time-coordinator",
      "gps-time-correction",
      "world-time-converter"
    ],
    faqs: [
      {
        question: "How long is a single Swatch beat?",
        answer: "A single beat is equal to exactly 1 minute and 26.4 seconds. There are 1000 beats in a full 24-hour day."
      },
      {
        question: "What is Biel Mean Time (BMT)?",
        answer: "Biel Mean Time is the baseline reference timezone for Swatch beats, anchored at UTC+1 hour (the location of Swatch headquarters in Biel, Switzerland)."
      },
      {
        question: "Does Swatch Internet Time use daylight saving?",
        answer: "No. Beats run on a constant speed year-round and do not shift for daylight saving, keeping internet communication unified."
      }
    ]
  }
};
