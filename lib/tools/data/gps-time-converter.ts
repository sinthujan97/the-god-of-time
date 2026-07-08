import { ToolPageData } from "../toolPageData";

export const gpsTimeConverterData: ToolPageData = {
  slug: "gps-time-converter",
  name: "GPS Time Converter",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#D8F870",
  description: "Convert GPS time to UTC, Unix time, or local time. Handles leap seconds and GPS week rollover.",

  seo: {
    title: "GPS Time Converter | Convert GPS to UTC Free",
    metaDescription: "Free GPS time converter. Convert GPS time to UTC, Unix time, or local time. Handles leap seconds and GPS week rollover. No signup required.",
    introText:
      "This GPS time converter instantly converts GPS satellite time into UTC, Unix time, or your local time, correctly accounting for leap seconds along the way. GPS time counts continuously in seconds from its epoch of January 6, 1980, and unlike UTC, it never inserts leap seconds to stay synced with Earth's slowing rotation — as a result, GPS time currently runs 18 seconds ahead of UTC. Use this tool to convert GPS time to UTC, run gps time calculator conversions for week-number-and-seconds-of-week formats, or translate any gps epoch time converter output into a standard calendar date — a workflow relied on by developers, engineers, researchers, and GPS/GNSS professionals working with satellite navigation systems.",
    howToTitle: "How to Convert GPS Time to UTC",
    howToSteps: [
      "Enter the GPS week number from your receiver or log file.",
      "Enter the seconds of week value that accompanies it.",
      "Read the UTC equivalent instantly — calculated as UTC = GPS Time − Leap Seconds (currently 18 seconds as of 2017)."
    ],
    useCases: [
      {
        title: "GPS Time vs UTC — Key Differences",
        content:
          "GPS time began at midnight on January 6, 1980 and has run as a continuous, unbroken count of seconds ever since — critically, it never adds leap seconds. UTC, by contrast, periodically inserts a leap second to compensate for the gradual, irregular slowing of Earth's rotation, which keeps civil time aligned with solar noon over the long term. Because GPS time skips these insertions entirely, the gap between the two systems grows by exactly one second every time UTC adds a leap second — as of the most recent addition in 2017, GPS time sits 18 seconds ahead of UTC. This offset matters enormously for satellite navigation, since GPS receivers must apply the correct leap second correction to compute accurate position and timing, and getting it wrong introduces real positioning error. A second technical wrinkle is the GPS week number, which is stored in a limited-width field and rolls over every 1024 weeks (about 19.7 years) — rollovers occurred in 1999 and 2019, with the next expected around 2038, and older GPS hardware that doesn't handle the rollover correctly can misread dates entirely."
      }
    ],
    faqs: [
      {
        question: "What is GPS time and how does it differ from UTC?",
        answer:
          "GPS time is a continuous time scale that started at midnight on January 6, 1980 and never adds leap seconds. UTC periodically adds leap seconds to stay aligned with Earth's rotation. As of 2017, GPS time is exactly 18 seconds ahead of UTC, and this difference grows whenever UTC adds a new leap second."
      },
      {
        question: "How do I convert GPS time to UTC?",
        answer:
          "Subtract the current number of leap seconds (18 as of 2017) from GPS time to get UTC. For GPS time expressed as week number and seconds-of-week, first convert to a total seconds count from the GPS epoch (January 6, 1980), then subtract 18 seconds and convert to calendar date and time."
      },
      {
        question: "What are leap seconds and how do they affect GPS time?",
        answer:
          "Leap seconds are one-second adjustments added to UTC to account for the gradual slowing of Earth's rotation. GPS time ignores leap seconds entirely, so the offset between GPS and UTC increases by 1 second each time a leap second is added. There have been 18 leap seconds added since GPS time began in 1980."
      },
      {
        question: "Can I convert GPS time to Unix time?",
        answer:
          "Yes. Unix time counts seconds from January 1, 1970. GPS time counts from January 6, 1980. The offset is 315,964,800 seconds plus the number of leap seconds at your target time. Add this offset to your GPS timestamp to get the Unix timestamp."
      },
      {
        question: "How does the GPS week number rollover work?",
        answer:
          "GPS week numbers are stored in a 10-bit field, meaning they roll over every 1,024 weeks (approximately 19.7 years). The first rollover occurred on August 21, 1999, the second on April 6, 2019. The next rollover will occur around November 2038. Older GPS receivers may misinterpret dates after a rollover."
      },
      {
        question: "What is the current GPS time in seconds?",
        answer:
          "GPS time in seconds is calculated from midnight January 6, 1980 UTC. This converter shows the current GPS time automatically and updates in real time. You can also enter any past or future date to find the corresponding GPS timestamp."
      }
    ],
    internalLinksText:
      "To convert Unix epoch time to human-readable dates, use the Unix Timestamp Converter. To convert local time to UTC/Zulu time, try the Zulu Time Converter. To view all historical leap seconds since 1972, see the Leap Second History Log.",
    relatedToolSlugs: [
      "unix-timestamp-converter",
      "zulu-time-converter",
      "leap-second-log"
    ]
  }
};
