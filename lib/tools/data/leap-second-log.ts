import { ToolPageData } from "../toolPageData";

export const leapSecondLogData: ToolPageData = {
  slug: "leap-second-log",
  name: "Leap Second History Log",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#F5A857",
  description: "Browse historical logs of leap seconds introduced into standard UTC time to keep sync with Earth's rotation.",
  
  seo: {
    title: "Leap Second History Log | UTC Time Correction Archive",
    metaDescription: "Browse the archive of leap seconds added to Coordinated Universal Time (UTC) since 1972. View historical drift logs and rotation metrics.",
    introText: "The Leap Second History Log lists all time adjustments introduced by the International Earth Rotation and Reference Systems Service (IERS). These adjustments keep atomic-based UTC time synchronized with the astronomical rotation of the Earth.",
    howToTitle: "How to Browse Leap Seconds",
    howToSteps: [
      "Select a year filter to search for specific historical adjustments.",
      "Browse the timeline cards listing correction events.",
      "Compare the cumulative differences between atomic time (TAI) and civilian UTC.",
      "Read details on why leap seconds are added and their technical impact."
    ],
    useCases: [
      {
        title: "Systems Administration audits",
        content: "Investigate if historical database crashes match the exact seconds leap updates were applied."
      },
      {
        title: "Astronomical Tracking Calibration",
        content: "Check historic leap second offsets to align telescope coordinates with old star maps."
      },
      {
        title: "Academic Timekeeping Research",
        content: "Examine the frequency of leap seconds since 1972 to study changes in Earth's rotation."
      }
    ],
    internalLinksText: "To calibrate GPS offset schedules, check the GPS Time Correction Tool. To look up timezone codes, use the Time Zone Abbreviation Directory.",
    relatedToolSlugs: [
      "gps-time-correction",
      "timezone-abbreviations",
      "unix-timestamp-converter"
    ],
    faqs: [
      {
        question: "Why do we need leap seconds?",
        answer: "Atomic clocks keep constant time, but Earth's rotation is gradually slowing due to tidal friction. Leap seconds are added to keep the atomic clock from drifting away from the solar day."
      },
      {
        question: "Why are leap seconds always added on June 30 or December 31?",
        answer: "These dates are international timekeeping standards, representing the end of the mid-year and end-of-year months, minimizing scheduling disruptions."
      },
      {
        question: "What is a negative leap second?",
        answer: "If Earth's rotation sped up, a second would need to be removed (clocks skipping from 23:59:58 to 00:00:00). A negative leap second has never been required."
      }
    ]
  }
};
