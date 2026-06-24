import { ToolPageData } from "../toolPageData";

export const daysSinceCounterData: ToolPageData = {
  slug: "days-since-counter",
  name: "Days Since Counter",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Track the days, hours, minutes, and seconds elapsed since a past historical event or life milestone.",
  
  seo: {
    title: "Days Since Calculator | Time Elapsed Counter",
    metaDescription: "Calculate the exact number of days since a past date. Live ticking stopwatch showing days, hours, minutes, and seconds elapsed since any milestone.",
    introText: "The Days Since Counter tracks the exact duration that has elapsed from a past reference date up to the present moment. Whether you are tracking a sobriety milestone, calculating the age of a project, or checking how long ago a historical event occurred, this tool provides a live ticking display showing days, hours, minutes, and seconds elapsed.",
    howToTitle: "How to Count Days Since a Past Date",
    howToSteps: [
      "Select your reference past date using the date picker.",
      "Watch the counter start ticking up live immediately.",
      "Read the primary display for total days elapsed, alongside the precise hours, minutes, and seconds breakdown."
    ],
    useCases: [
      {
        title: "For Sobriety and Habit Tracking",
        content: "Track days since quitting a habit or starting a sobriety streak. The live ticking representation provides a powerful visual reinforcement of progress made."
      },
      {
        title: "For Project and Business Age",
        content: "Determine the exact number of days since a startup was founded, a website was launched, or a machinery service was last conducted. Useful for compliance logs and anniversary celebrations."
      },
      {
        title: "For Customer Support & SLA Tracking",
        content: "Calculate the duration since a ticket was opened or a customer last contacted support to monitor response efficiency and ensure standards are met."
      }
    ],
    internalLinksText: "To count down the days remaining until an upcoming event, use the Days Until Counter. To calculate the number of working days between two dates, use the Business Days Calculator.",
    relatedToolSlugs: [
      "days-until-counter",
      "days-between-dates",
      "business-days-calculator"
    ],
    faqs: [
      {
        question: "Does the counter update continuously?",
        answer: "Yes. The counter uses your local system clock to update the elapsed duration live, ticking up by one second every second."
      },
      {
        question: "Can I enter dates thousands of years in the past?",
        answer: "Yes, the calendar engine supports historical dates going back to the year 1000, allowing you to compute durations for historical events accurately."
      },
      {
        question: "What happens if I pick a date in the future?",
        answer: "If you select a future date, the tool automatically functions as a countdown, indicating how many days are left until that date."
      }
    ]
  }
};
