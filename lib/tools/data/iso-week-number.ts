import { ToolPageData } from "../toolPageData";

export const isoWeekNumberData: ToolPageData = {
  slug: "iso-week-number",
  name: "ISO Week Number Calculator",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Find the ISO 8601 week number and year representation for any date.",
  
  seo: {
    title: "ISO Week Number Calculator | Week of Year Finder",
    metaDescription: "Find the ISO 8601 week number for any date. See exact week start and end dates (Monday to Sunday) and day-of-year details.",
    introText: "The ISO Week Number Calculator determines the exact week number (1 to 53) for any date according to the ISO 8601 standard. Used globally in business, finance, and software development, the ISO week date system establishes a unified standard where week 1 is defined as the week containing the first Thursday of the calendar year.",
    howToTitle: "How to Find the ISO Week Number",
    howToSteps: [
      "Select a date using the date picker.",
      "Read the week number instantly.",
      "Review the week's starting Monday and ending Sunday dates, along with a visual week calendar strip showing your selected date's position."
    ],
    useCases: [
      {
        title: "For Corporate Scheduling & Reporting",
        content: "Many international corporations plan inventory, reports, and marketing sprints by week numbers (e.g. 'Week 24 review'). This ensures all teams are aligned regardless of varying month boundaries."
      },
      {
        title: "For Retail & Logistics Supply Chains",
        content: "Retail systems allocate delivery quotas and shipping deadlines by week numbers. Knowing start/end dates for the week ensures shipments arrive within expectations."
      },
      {
        title: "For Software Engineering & Logs",
        content: "Data logging databases organize logs by ISO weeks. This tool helps trace dates back to log identifiers."
      }
    ],
    internalLinksText: "To find which day of the week a date falls on, use the Day of the Week Finder. To count days between dates, use the Days Between Dates Calculator.",
    relatedToolSlugs: [
      "day-of-week-finder",
      "days-between-dates",
      "add-days-to-date"
    ],
    faqs: [
      {
        question: "What is the ISO 8601 week standard?",
        answer: "Under ISO 8601, weeks begin on Monday and end on Sunday. Week 1 is the week that contains the first Thursday of the year, which is equivalent to saying it contains January 4th."
      },
      {
        question: "Can a date in January belong to the previous year's week?",
        answer: "Yes. For example, January 1st, 2nd, or 3rd can fall in week 52 or 53 of the preceding year if they occur before the first Thursday. The calculator handles these boundary cases automatically."
      },
      {
        question: "Are there always 52 weeks in a year?",
        answer: "Most years have 52 weeks, but years that start on a Thursday (or leap years starting on a Wednesday) have 53 weeks."
      }
    ]
  }
};
