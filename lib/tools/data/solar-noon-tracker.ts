import { ToolPageData } from "../toolPageData";

export const solarNoonTrackerData: ToolPageData = {
  slug: "solar-noon-tracker",
  name: "True Solar Noon Precision Tracker",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#F5A857",
  description: "Calculate the exact moment of daily solar noon, sun elevation angles, and shadow ratios for any coordinates.",
  
  seo: {
    title: "True Solar Noon Precision Tracker | Solar Zenith Calculator",
    metaDescription: "Calculate the exact time when the sun reaches its highest point in the sky. Estimates elevation angles and shadow ratios.",
    introText: "The True Solar Noon Precision Tracker calculates the exact moment when the sun crosses your meridian and reaches its highest point in the sky. By inputting latitude and longitude, you can determine local noon, sun elevation, and shadow length ratios.",
    howToTitle: "How to Track Solar Noon",
    howToSteps: [
      "Select a target evaluation date.",
      "Enter the coordinates (Latitude and Longitude) of your location.",
      "Review the calculated solar noon time displayed on your local clock.",
      "Check the elevation angle and the corresponding shadow ratio."
    ],
    useCases: [
      {
        title: "Solar Panel Alignment",
        content: "Determine solar noon to adjust panels to face directly at the sun during peak elevation hours."
      },
      {
        title: "Photography and Shadow Control",
        content: "Schedule architectural photography to capture the shortest shadows of the day."
      },
      {
        title: "Navigational Sextant Auditing",
        content: "Use apparent zenith measurements to verify location latitude coordinates manually."
      }
    ],
    internalLinksText: "To graph general solar variance curves, use the Solar Time vs Standard Time Tracker. To locate timezones by clicking a map, try the Time Zone Finder by Map Click.",
    relatedToolSlugs: [
      "solar-vs-standard-time",
      "timezone-map-finder",
      "dst-tracker"
    ],
    faqs: [
      {
        question: "Does solar noon always occur at 12:00 PM?",
        answer: "Rarely. Solar noon depends on your location within your timezone and seasonal variations described by the Equation of Time. It can occur up to 45 minutes before or after 12:00 PM."
      },
      {
        question: "How is the shadow ratio calculated?",
        answer: "The shadow ratio is calculated as 1 / tan(elevation angle). A shadow ratio of 1.0 means an object's shadow length is equal to its height."
      },
      {
        question: "Does elevation angle change with latitude?",
        answer: "Yes, the sun's peak daily elevation increases closer to the equator and decreases closer to the poles."
      }
    ]
  }
};
