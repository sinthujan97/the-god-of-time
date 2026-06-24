import { ToolPageData } from "../toolPageData";

export const multiCityClockData: ToolPageData = {
  slug: "multi-city-clock",
  name: "Multi-City Desktop Grid Clock",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#F5A857",
  description: "Pin multiple active clocks to a customized grid to watch live time zones simultaneously.",
  
  seo: {
    title: "Multi-City Desktop Grid Clock | Live International Clock Grid",
    metaDescription: "Monitor multiple city clocks on a single dashboard. Custom-configure your list of pinned global locations and watch active timezone updates.",
    introText: "The Multi-City Desktop Grid Clock is a visual monitoring dashboard for remote workers, traders, and international communicators. By selecting up to 6 custom global locations, you can watch live ticking clocks in a unified grid, keeping track of day/night cycles across your branches.",
    howToTitle: "How to Build a Clock Grid",
    howToSteps: [
      "View the default clock grid containing London, Tokyo, and New York.",
      "Use the search panel to select and add new cities to your pinned grid.",
      "Remove clocks that are not relevant to your current project.",
      "Check the ticking seconds and day/night indicator colors on each card."
    ],
    useCases: [
      {
        title: "Virtual Team Operations",
        content: "Pin the time zones of your remote developers to check if they are currently online before pinging them."
      },
      {
        title: "Commodities and stock Trading",
        content: "Track market opening and closing hours for exchanges in London, New York, and Hong Kong."
      },
      {
        title: "Family Communication",
        content: "Keep track of the local time for family members living abroad to call during reasonable hours."
      }
    ],
    internalLinksText: "To convert coordinates by tapping locations visually, use the Time Zone Finder by Map Click. To convert specific custom times, try the World Time Zone Converter.",
    relatedToolSlugs: [
      "timezone-map-finder",
      "world-time-converter",
      "meeting-planner"
    ],
    faqs: [
      {
        question: "Is there a limit to how many clocks I can pin?",
        answer: "The layout is optimized to display up to 6 clocks concurrently on desktop and mobile screens to avoid visual clutter."
      },
      {
        question: "Does this grid clock drain device battery?",
        answer: "No. The ticking update logic uses highly optimized React render loops that minimize CPU usage while keeping time accurate."
      },
      {
        question: "How does the tool know my local time?",
        answer: "The clocks sync with your device's system time, applying offset values based on standard IANA timezone algorithms."
      }
    ]
  }
};
