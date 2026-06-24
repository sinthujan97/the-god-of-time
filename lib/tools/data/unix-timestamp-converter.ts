import { ToolPageData } from "../toolPageData";

export const unixTimestampConverterData: ToolPageData = {
  slug: "unix-timestamp-converter",
  name: "Unix Timestamp Converter",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#F5A857",
  description: "Convert Unix epoch timestamps (seconds or milliseconds) to human-readable dates and vice versa.",
  
  seo: {
    title: "Unix Timestamp Converter | Epoch Time Developer Tool",
    metaDescription: "Convert epoch seconds and milliseconds into UTC and local ISO dates. Generate developer code snippet conversions instantly.",
    introText: "The Unix Timestamp Converter is a programmer's utility to translate raw epoch integers (the number of seconds elapsed since January 1, 1970 UTC) into standard calendar dates, and convert standard dates back into Unix code variables.",
    howToTitle: "How to Convert Unix Timestamps",
    howToSteps: [
      "Select your translation mode: Epoch to Date, or Date to Epoch.",
      "Input the numerical timestamp (supports seconds or milliseconds) or pick a calendar date/time.",
      "Review the results displaying equivalent local time, UTC time, and ISO 8601 strings.",
      "Use the quick-copy button to paste the result directly into your code editor."
    ],
    useCases: [
      {
        title: "Database Log Auditing",
        content: "Translate integer timestamps found in database error dumps or transaction logs to determine exactly when a failure occurred."
      },
      {
        title: "API Payload Coding",
        content: "Generate Unix timestamp values to build API requests that require strict epoch parameters."
      },
      {
        title: "Security Token Validation",
        content: "Decode the expiry ('exp') epoch timestamp in JSON Web Tokens (JWT) to check token lifespan issues."
      }
    ],
    internalLinksText: "To calibrate network system latency parameters, use the NTP Server Latency Tester. To inspect historical UTC adjustments, check the Leap Second History Log.",
    relatedToolSlugs: [
      "ntp-latency-tester",
      "leap-second-log",
      "utc-gmt-offset"
    ],
    faqs: [
      {
        question: "What happens when Unix time reaches the year 2038?",
        answer: "On January 19, 2038, 32-bit Unix integers will overflow. Systems are actively upgrading to 64-bit integers, which prevents this issue for billions of years."
      },
      {
        question: "How does the tool distinguish between seconds and milliseconds?",
        answer: "The converter checks the length of the input. Timestamps with 10 digits are parsed as seconds, while 13 digits or more are treated as milliseconds."
      },
      {
        question: "Is Unix time affected by leap seconds?",
        answer: "Unix time ignores leap seconds. Every day is treated as having exactly 86,400 seconds, meaning Unix clocks briefly adjust during leap updates."
      }
    ]
  }
};
