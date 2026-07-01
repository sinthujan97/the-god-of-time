import { ToolPageData } from "../toolPageData";

export const recurringEventRruleData: ToolPageData = {
  slug: "recurring-event-rrule",
  name: "Recurring Event RRule Generator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Generate standard RFC 5545 iCalendar Recurrence Rules (RRule) and preview upcoming occurrence dates.",
  
  seo: {
    title: "Recurring Event RRule Generator | iCalendar RFC 5545",
    metaDescription: "Generate standard iCalendar RRULE strings for calendar applications. Set frequencies, intervals, count, and preview upcoming occurrence dates.",
    introText: "The Recurring Event RRule Generator is a technical tool for developers and calendar managers to construct RFC 5545 compliant recurrence strings. Input repeat cycles (daily, weekly, monthly, yearly), set ending conditions, specify days of the week, and the engine generates the standard RRULE code while displaying a preview of the next 10 occurrences.",
    howToTitle: "How to Generate iCalendar RRules",
    howToSteps: [
      "Select the starting date and time for the recurring event series.",
      "Choose the recurrence frequency (Daily, Weekly, Monthly, or Yearly).",
      "Specify the recurrence interval (e.g., every 2 weeks, every 3 months).",
      "Set the ending condition: never, after a specific count of occurrences, or on a fixed end date.",
      "Copy the generated RRULE string and inspect the calendar dates list below."
    ],
    useCases: [
      {
        title: "Calendar Software Integration",
        content: "Developers building custom booking, task manager, or CRM software use RRule generation to store recurring schedules in databases using standardized strings."
      },
      {
        title: "iCalendar (.ics) File Creation",
        content: "Marketing teams creating downloadable invite links for newsletters or training webinars use RRule strings to ensure the calendar invite repeating behavior translates correctly."
      },
      {
        title: "Corporate Meeting Series Scheduling",
        content: "Operations leads generating recurring schedules for quarterly audits or monthly shareholder meetings use RRule strings to sync timetables across different corporate calendar suites."
      }
    ],
    internalLinksText: "To plan agile team iterations, try the Agile Sprint Date Calculator. For corporate calendar mapping, check the Fiscal Quarter & Year Calculator. To plan milestone timelines, use the Project Deadline Back-Planner.",
    relatedToolSlugs: [
      "sprint-date-calculator",
      "fiscal-quarter-calculator",
      "project-back-planner"
    ],
    faqs: [
      {
        question: "What is an RRule in calendar systems?",
        answer: "An RRule (Recurrence Rule) is a standard syntax defined in RFC 5545 (iCalendar specification) used to describe a recurring event pattern. It allows applications like Google Calendar, Outlook, and Apple Calendar to display repeating meetings from a single event description."
      },
      {
        question: "What are the common RRule parameters?",
        answer: "Common parameters include FREQ (frequency, e.g., WEEKLY), INTERVAL (how often the frequency repeats), BYDAY (specific days, e.g., MO,WE), UNTIL (end date), and COUNT (number of repetitions before stopping)."
      },
      {
        question: "Does the generator support timezone settings?",
        answer: "The RRule string itself describes the repeat pattern, which is independent of timezone. However, the generator uses UTC timestamps or floating times to ensure compatibility across client time zones."
      }
    ]
  }
};
