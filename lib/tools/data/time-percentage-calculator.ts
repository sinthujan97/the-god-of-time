import { ToolPageData } from "../toolPageData";

export const timePercentageCalculatorData: ToolPageData = {
  slug: "time-percentage-calculator",
  name: "Time Percentage Calculator",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Calculate how much of a day or year has elapsed.",
  
  seo: {
    title: "Time Percentage Calculator | Day & Year Progress Tracker",
    metaDescription: "Calculate the exact percentage of the day or year that has elapsed. Visual progress bars updating in real time for productivity tracking.",
    introText: "The Time Percentage Calculator calculates what percentage of the current day or year has elapsed. A popular tool for productivity tracking, journaling, and mindful reflection, it renders a visual progress bar and ticks up in real time to show how time is passing.",
    howToTitle: "How to Track Time Percentages",
    howToSteps: [
      "Select 'Day Progress' tab and enter a custom time, or view the default current time to see what percentage of the 24-hour day has passed.",
      "Select 'Year Progress' tab to see what percentage of the current year (taking leap years into account) has elapsed.",
      "Review the visual accent progress bar representing the completion of the time interval."
    ],
    useCases: [
      {
        title: "For Productivity and Time Blocking",
        content: "Knowing that 50% of the day has elapsed by 12:00 PM acts as a simple visual cue to review tasks completed versus tasks planned for the afternoon."
      },
      {
        title: "For Budgeting and Financial Targets",
        content: "Track year-to-date spending. Comparing year progress (e.g. 25% of year elapsed) with spending metrics prevents over-budgeting early in cycles."
      },
      {
        title: "For New Year Resolutions & Milestones",
        content: "Track your progress towards year-long goals with a tangible metric showing how much of the year remains."
      }
    ],
    internalLinksText: "To see how many days are left in the year, use the Days Until Counter. To calculate durations between two times, use the Time Duration Calculator.",
    relatedToolSlugs: [
      "days-until-counter",
      "time-duration-calculator",
      "add-subtract-time"
    ],
    faqs: [
      {
        question: "Does the calculation account for leap years?",
        answer: "Yes. For the 'Year Progress' mode, the tool detects if the current year is a leap year and adjusts the total days to 366 instead of 365, ensuring the percentage is mathematically precise."
      },
      {
        question: "Does this update in real time?",
        answer: "Yes, in the Year Progress tab (and Day Progress when displaying the current time), the percentage updates in real time to reflect elapsed seconds."
      },
      {
        question: "How is day progress calculated?",
        answer: "Day progress is calculated by converting the input time into total seconds elapsed since midnight and dividing by 86,400 (the total seconds in a day), then multiplying by 100."
      }
    ]
  }
};
