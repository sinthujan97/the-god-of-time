import { ToolPageData } from "../toolPageData";

export const goldenHourTrackerData: ToolPageData = {
  slug: "golden-hour-tracker",
  name: "Golden Hour & Blue Hour Tracker",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#E87C7C",
  description: "Identify daily morning and evening photography lighting windows based on target date and geographic coordinates.",
  
  seo: {
    title: "Golden Hour Blue Hour Tracker | Photography Natural Outdoor Lighting Windows",
    metaDescription: "Locate precise daily lighting windows and solar angles for creative media execution and landscape photography tracking.",
    introText: "The Golden Hour & Blue Hour Tracker projects photography lighting windows. By inputting latitude and longitude coordinates, it calculates sunrise/sunset offsets, locating the soft gold and deep blue hours.",
    howToTitle: "How to Track Photography Lighting",
    howToSteps: [
      "Select your target photography date.",
      "Input the latitude and longitude coordinates of your shoot location.",
      "Review the morning and evening golden and blue hour timetables.",
      "Plan your outdoor setup to align with peak lighting windows."
    ],
    useCases: [
      {
        title: "Portrait Photography Sessions",
        content: "Schedule outdoor portrait sessions during the golden hour to capture warm skin tones and soft shadows."
      },
      {
        title: "Architectural Exterior Shoots",
        content: "Capture exteriors during the blue hour to balance artificial building lights with deep sky hues."
      },
      {
        title: "Cinematic Film Production",
        content: "Time outdoor film scenes to secure natural, soft light without harsh mid-day reflections."
      }
    ],
    internalLinksText: "To track precise solar noon coordinates, use the True Solar Noon Precision Tracker. To map perpetual calendars, check the Perpetual Wall Calendar Blueprint.",
    relatedToolSlugs: [
      "solar-noon-tracker",
      "perpetual-calendar",
      "age-calculator"
    ],
    faqs: [
      {
        question: "What is the difference between golden hour and blue hour?",
        answer: "The golden hour occurs when the sun is low in the sky, casting warm, red-gold light. The blue hour occurs when the sun is below the horizon, bathing the landscape in cool blue tones."
      },
      {
        question: "How long do these lighting windows last?",
        answer: "Despite their names, these windows can last from 20 minutes to over an hour, depending on your latitude and the season."
      },
      {
        question: "Does weather affect the golden hour?",
        answer: "Yes, heavy cloud cover or fog blocks direct sunlight, diffusing the light and reducing the golden glow."
      }
    ]
  }
};
