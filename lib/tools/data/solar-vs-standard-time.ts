import { ToolPageData } from "../toolPageData";

export const solarVsStandardTimeData: ToolPageData = {
  slug: "solar-vs-standard-time",
  name: "Solar Time vs Standard Time Tracker",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#D8F870",
  description: "Compare solar tracking time to standard legal timezone representations using longitude and the Equation of Time.",
  
  seo: {
    title: "Solar Time vs Standard Time Tracker | Sundial Time Calculator",
    metaDescription: "Calculate the exact variance between local clock time and true solar time. Uses longitude correction and the Equation of Time.",
    introText: "The Solar Time vs Standard Time Tracker explores the differences between the civil time on our clocks and the true astronomical position of the sun. Because standard time zones stretch across hundreds of miles, clock times only match solar positions at specific meridians, creating variances across regions.",
    howToTitle: "How to Track Solar Variance",
    howToSteps: [
      "Enter your local longitude coordinates in decimal degrees (e.g. -74.0 for New York).",
      "Pick a calendar date and local time.",
      "Review the calculated Equation of Time value showing seasonal variations.",
      "Check the true solar time representing when the sun would cross your local meridian."
    ],
    useCases: [
      {
        title: "Sundial Calibration",
        content: "Determine if a garden sundial's shadow matches local clock time or requires seasonal correction."
      },
      {
        title: "Agricultural and Solar Planning",
        content: "Map solar hours to maximize greenhouse exposure or optimize solar panel output."
      },
      {
        title: "Astrophotography Setup",
        content: "Track solar positions to schedule high-contrast landscape photography or solar telescope sessions."
      }
    ],
    internalLinksText: "To find the exact moment the sun reaches its highest point, use the True Solar Noon Precision Tracker. To track geographic daylight limits, check the Daylight Saving Time Transition Tracker.",
    relatedToolSlugs: [
      "solar-noon-tracker",
      "dst-tracker",
      "timezone-map-finder"
    ],
    faqs: [
      {
        question: "What is the Equation of Time?",
        answer: "The Equation of Time describes the difference between apparent solar time (sundial time) and mean solar time (clock time). It varies by up to 16 minutes throughout the year due to Earth's elliptical orbit and axial tilt."
      },
      {
        question: "How does longitude affect solar time?",
        answer: "As Earth rotates, every degree of longitude represents a 4-minute time shift relative to the sun. If you live far from your timezone's central meridian, your solar time will differ from your clock time."
      },
      {
        question: "Can I use positive values for Eastern longitudes?",
        answer: "Yes, Eastern longitudes (like Europe and Asia) should be entered as positive numbers, while Western longitudes (like the Americas) should be negative numbers."
      }
    ]
  }
};
