import { ToolPageData } from "../toolPageData";

export const leapYearCheckerData: ToolPageData = {
  slug: "leap-year-checker",
  name: "Leap Year Checker",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#C5F135",
  description: "Check if a given year is a leap year according to the Gregorian calendar.",
  
  seo: {
    title: "Leap Year Checker | Calendar Year Math Finder",
    metaDescription: "Determine if any year is a leap year instantly. See upcoming leap years list, historical details, and the mathematical formula for leap years.",
    introText: "The Leap Year Checker tells you instantly whether a given year has 366 days (leap year) or 365 days (common year). Based on the official rules of the Gregorian calendar, this tool provides a detailed breakdown of the mathematical divisibility steps, shows the number of days in February for that year, and lists neighboring leap years.",
    howToTitle: "How to Check if a Year is a Leap Year",
    howToSteps: [
      "Enter a year in the year input box (supporting years 1 to 9999).",
      "Read the primary verdict immediately — displayed in bold display serif text.",
      "Review the division calculations and check the upcoming leap years list in the breakdown below."
    ],
    useCases: [
      {
        title: "For Finance and Interest Accrual",
        content: "Financial accounting standards differ on whether a year uses 360, 365, or 366 days for interest calculations (Actual/365 vs. Actual/366). Identifying whether a transaction year is a leap year is crucial for compliance."
      },
      {
        title: "For Software Developers & DBA Calendar Setup",
        content: "Developers and database administrators need to verify leap year boundaries when setting up calendars, date inputs, cron jobs, and database fields to avoid date bugs."
      },
      {
        title: "For Historical & Educational Research",
        content: "Verify whether past historical milestones occurred during a leap year and learn how calendar adjustments keep our modern calendar in sync with the solar year."
      }
    ],
    internalLinksText: "To find standard day counts between two dates across leap years, use the Days Between Dates Calculator. For finding week structures, use the ISO Week Number Calculator.",
    relatedToolSlugs: [
      "days-between-dates",
      "iso-week-number",
      "day-of-week-finder"
    ],
    faqs: [
      {
        question: "What is the leap year formula?",
        answer: "A year is a leap year if it is divisible by 4, except for end-of-century years, which must also be divisible by 400. Thus, 1900 was not a leap year, but 2000 was."
      },
      {
        question: "Why do we have leap years?",
        answer: "Earth takes approximately 365.2422 days to orbit the sun. Adding a leap day every 4 years compensates for this extra fraction, preventing our calendar seasons from shifting out of alignment."
      },
      {
        question: "Which are the next 5 leap years?",
        answer: "The next upcoming leap years are 2028, 2032, 2036, 2040, and 2044."
      }
    ]
  }
};
