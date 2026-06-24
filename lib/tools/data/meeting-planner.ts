import { ToolPageData } from "../toolPageData";

export const meetingPlannerData: ToolPageData = {
  slug: "meeting-planner",
  name: "Meeting Planner Sweet-Spot Finder",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#F5A857",
  description: "Find the optimal overlapping hours for international conference calls and meetings.",
  
  seo: {
    title: "Meeting Planner Sweet-Spot Finder | Time Zone Overlap Planner",
    metaDescription: "Input multiple global cities to generate a color-coded 24-hour visual matrix. Easily find working hours overlap for distributed teams.",
    introText: "The Meeting Planner Sweet-Spot Finder helps you find the most convenient times for online meetings across multiple time zones. By color-coding hours into working (green), personal (yellow), and sleeping (red) categories, you can coordinate meetings that respect everyone's schedules.",
    howToTitle: "How to Find Meeting Overlaps",
    howToSteps: [
      "Select the proposed meeting date using the datepicker.",
      "Add the timezones of all participants to the active planner list.",
      "Review the 24-hour grid. Rows highlighted as optimal overlap represent times when all members are in working hours.",
      "Copy the recommended meeting details to share with your team."
    ],
    useCases: [
      {
        title: "Distributed Agile Standups",
        content: "Find a 15-minute slot for daily standups that fits between Tokyo's evening and London's morning."
      },
      {
        title: "Cross-Border Executive Boards",
        content: "Schedule major quarterly meetings where international board members are fully awake and alert."
      },
      {
        title: "Client Pitch Alignment",
        content: "Choose time slots that show professional courtesy by avoiding client personal or dining hours."
      }
    ],
    internalLinksText: "To see live time zone grids, use the Multi-City Desktop Grid Clock. To analyze numeric hour offsets, use the Time Zone Relative Difference Grid.",
    relatedToolSlugs: [
      "world-time-converter",
      "multi-city-clock",
      "timezone-difference-grid"
    ],
    faqs: [
      {
        question: "What are the default working hours in the grid?",
        answer: "The grid defaults standard working hours to 9:00 AM (09:00) through 5:00 PM (17:00) local time for each participant."
      },
      {
        question: "What happens if there is no perfect working-hours overlap?",
        answer: "The scheduler will highlight the 'best available' compromise slot where participants are in personal hours rather than sleeping hours."
      },
      {
        question: "Does it adjust for weekend boundaries?",
        answer: "Yes, the date picker allows you to evaluate specific dates to verify if holidays or weekend shifts apply in target countries."
      }
    ]
  }
};
