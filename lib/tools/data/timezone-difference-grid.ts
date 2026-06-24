import { ToolPageData } from "../toolPageData";

export const timezoneDifferenceGridData: ToolPageData = {
  slug: "timezone-difference-grid",
  name: "Time Zone Relative Difference Grid",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#F5A857",
  description: "View a visual matrix showing offsets relative to your own timezone or standard base zones.",
  
  seo: {
    title: "Time Zone Relative Difference Grid | Relative Offset Calculator",
    metaDescription: "Calculate numeric hour variations between multiple global offices. Create relative offset reference grids for remote management.",
    introText: "The Time Zone Relative Difference Grid calculates the exact mathematical hour difference between a source timezone and multiple target zones. This reference tool helps team managers, call centers, and logistics hubs instantly see who is 'ahead' or 'behind' and by how many hours.",
    howToTitle: "How to Build a Difference Grid",
    howToSteps: [
      "Select your baseline timezone (defaults to your local zone).",
      "Add target timezones to compare.",
      "Review the results list showing positive (+ hours) and negative (- hours) offsets.",
      "Check the descriptive labels explaining if target zones are ahead or behind."
    ],
    useCases: [
      {
        title: "Call Center Operations",
        content: "Determine if calls to a region will ring in the early morning or late night relative to your central hub."
      },
      {
        title: "Remote Team Onboarding",
        content: "Provide new employees with a simple reference grid showing how many hours ahead or behind they are relative to headquarters."
      },
      {
        title: "Logistics and Shipping Dispatch",
        content: "Track time variations for long-haul deliveries across multiple time zones."
      }
    ],
    internalLinksText: "To click on a world map to check zones, try the Time Zone Finder by Map Click. To convert specific custom times, use the World Time Zone Converter.",
    relatedToolSlugs: [
      "timezone-map-finder",
      "world-time-converter",
      "meeting-planner"
    ],
    faqs: [
      {
        question: "Can offsets be fractional?",
        answer: "Yes. Timezones like India Standard Time (UTC+5:30) or Australian Central Time (UTC+9:30) will return fractional differences (e.g., +5.5 or +9.5 hours)."
      },
      {
        question: "Does this grid update during DST changes?",
        answer: "Yes, the calculations update in real time based on active seasonal offsets of your selected date."
      },
      {
        question: "How is this different from a standard world clock?",
        answer: "A world clock shows the current time of a city. This grid highlights the mathematical offset difference between locations, simplifying schedule math."
      }
    ]
  }
};
