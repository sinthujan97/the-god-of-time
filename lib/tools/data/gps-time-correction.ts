import { ToolPageData } from "../toolPageData";

export const gpsTimeCorrectionData: ToolPageData = {
  slug: "gps-time-correction",
  name: "GPS Time Correction Tool",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#F5A857",
  description: "Calculate differences between GPS time, International Atomic Time (TAI), and UTC incorporating leap seconds.",
  
  seo: {
    title: "GPS Time Correction Tool | Leap Second Calibration Calculator",
    metaDescription: "Calculate the exact drift offset between GPS clock signals, International Atomic Time (TAI), and Coordinated Universal Time (UTC).",
    introText: "The GPS Time Correction Tool is a high-tech calibration dashboard. It models the cumulative offsets between civilian UTC time, raw satellite GPS times, and International Atomic Time (TAI), showing how leap second insertions cause these high-precision scales to diverge.",
    howToTitle: "How to Calibrate GPS Time",
    howToSteps: [
      "Select a reference UTC date and time to evaluate.",
      "Check the calculated total accumulated leap seconds for that epoch.",
      "Compare the ticking time displays for TAI, GPS, and UTC scales.",
      "Review the GPS seconds integer used by satellite triangulation algorithms."
    ],
    useCases: [
      {
        title: "Satellite Navigation Calibration",
        content: "Calculate receiver timing offsets to ensure GPS location coordinates are calculated accurately."
      },
      {
        title: "High-Frequency Stock Trading",
        content: "Audit server timestamps using TAI or GPS time to resolve trades in sub-millisecond orders."
      },
      {
        title: "Telecom Network Synchronization",
        content: "Calibrate cell tower base station clocks to prevent data transmission collisions."
      }
    ],
    internalLinksText: "To view the chronological log of leap second updates, search the Leap Second History Log. To run local clock offset measurements, use the NTP Server Latency Tester.",
    relatedToolSlugs: [
      "leap-second-log",
      "ntp-latency-tester",
      "unix-timestamp-converter"
    ],
    faqs: [
      {
        question: "Why do GPS time and UTC time differ?",
        answer: "GPS time was synchronized with UTC in 1980. Since then, UTC has added leap seconds to match Earth's slowing rotation, while GPS time runs continuously without updates, making it run 18 seconds ahead."
      },
      {
        question: "How far ahead is TAI compared to UTC?",
        answer: "International Atomic Time (TAI) is exactly 37 seconds ahead of UTC as of the latest update, representing all leap seconds added since 1972 plus the initial offset."
      },
      {
        question: "Will leap seconds ever be abolished?",
        answer: "Yes, international metrology bodies have decided to phase out leap seconds by 2035 to prevent disruptions in global computing networks."
      }
    ]
  }
};
