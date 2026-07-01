import { ToolPageData } from "../toolPageData";

export const addDaysToDateData: ToolPageData = {
  slug: "add-days-to-date",
  name: "Add Days to Date Tool",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#C5F135",
  description: "Find any future or past date by adding or subtracting days, weeks, months, or years from a start date.",
  
  seo: {
    title: "Add Days to Date Calculator | Future Date Finder",
    metaDescription: "Add or subtract days, weeks, months, or years from any date. Find your exact future or past date instantly with our free date calculator.",
    introText: "The Add Days to Date Calculator finds the exact future or past date when you add or subtract a specific number of days, weeks, months, or years from any starting point. Whether you are calculating a project deadline 30 days from today, finding a date 6 months from a contract signing, or working out what date falls 100 days from now, this free date addition tool gives you the precise calendar date instantly — including the day of the week and week number.",
    howToTitle: "How to Add Days to a Date",
    howToSteps: [
      "Select your start date using the date picker. The tool defaults to today so you can immediately calculate forward from the current date.",
      "Enter the number of days, weeks, months, or years you want to add. Use a negative number to subtract and find a date in the past — for example, enter -30 to find the date 30 days ago.",
      "Read the result date instantly. The breakdown below shows the day of the week, week number of the year, and whether the result year is a leap year."
    ],
    useCases: [
      {
        title: "For Contract and Notice Periods",
        content: "Legal and business contracts frequently specify deadlines as a number of days from a trigger date. A 90-day notice period starting February 1st ends May 2nd — not April 30th. This tool accounts for real calendar month lengths so you always land on the correct date without manual counting."
      },
      {
        title: "For Subscription and Trial Expiry Dates",
        content: "Free trials, software subscriptions, and service agreements often run for 14, 30, or 90 days from a start date. Add your trial start date and the trial length to find the exact expiry date before you get charged."
      },
      {
        title: "For Pregnancy and Health Milestones",
        content: "Medical timelines frequently work in weeks from a reference date. Add 40 weeks to a last menstrual period date to estimate a due date, or add specific week intervals to track trimester boundaries and prenatal appointment windows."
      },
      {
        title: "For Event and Travel Planning",
        content: "Planning a trip 6 months from today? Need to know what day of the week a date falls on? Add your duration in months and the tool immediately shows whether your result lands on a weekend or weekday — critical for booking flights and accommodation."
      }
    ],
    internalLinksText: "To count the total days between two known dates instead, use the Days Between Dates Calculator. To subtract days from a date directly, use the Subtract Days from Date tool. For business day calculations that exclude weekends, the Business Days Calculator handles this automatically.",
    relatedToolSlugs: [
      "days-between-dates",
      "subtract-days-from-date",
      "business-days-calculator"
    ],
    faqs: [
      {
        question: "What happens when I add months to a month-end date?",
        answer: "The calculator handles month-end edge cases correctly. Adding 1 month to January 31st returns February 28th (or 29th in a leap year) — not March 2nd or 3rd. The result always stays within the target month."
      },
      {
        question: "Can I subtract days instead of adding them?",
        answer: "Yes. Enter a negative number in the amount field to subtract. For example, entering -30 with today as the start date returns the date 30 days ago. This works for all units — days, weeks, months, and years."
      },
      {
        question: "How do I add years across a leap year boundary?",
        answer: "If you add 1 year to February 29th in a leap year, the result is February 28th the following year since February 29th does not exist in non-leap years. The calculator handles this automatically."
      },
      {
        question: "What is the maximum number of days I can add?",
        answer: "The calculator supports adding or subtracting up to 999,999 days, which is approximately 2,738 years. This covers virtually all practical use cases including long-term contract and historical date calculations."
      },
      {
        question: "Does adding months use 30-day months or real calendar months?",
        answer: "Real calendar months. Adding 1 month to March 15th returns April 15th — not April 14th or 16th. The tool increments the month value directly, accounting for the actual length of each month in the calendar."
      }
    ]
  }
};
