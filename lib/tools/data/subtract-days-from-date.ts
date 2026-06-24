import { ToolPageData } from "../toolPageData";

export const subtractDaysFromDateData: ToolPageData = {
  slug: "subtract-days-from-date",
  name: "Subtract Days from Date Tool",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Find any past date by subtracting days, weeks, months, or years from a start date instantly.",
  
  seo: {
    title: "Subtract Days from Date Calculator | Past Date Finder",
    metaDescription: "Subtract days, weeks, months, or years from any date to find an exact past date. Free reverse date calculator with day of week and week number.",
    introText: "The Subtract Days from Date Calculator finds the exact past date when you count backward from any starting point by a specific number of days, weeks, months, or years. Use it to find what date fell 90 days before a deadline, when a warranty period started, or what day of the week a historical date landed on. Enter your reference date and duration above for an instant result.",
    howToTitle: "How to Subtract Days from a Date",
    howToSteps: [
      "Select your reference date — the date you are counting backward from. This is typically today or a known deadline date.",
      "Enter the number of units to subtract and select whether you are counting in days, weeks, months, or years.",
      "Read the result date below. The breakdown shows how far back your result falls expressed as a full calendar date with day of week and year."
    ],
    useCases: [
      {
        title: "For Warranty and Return Window Lookups",
        content: "If a product warranty runs for 1 year and expires today, subtract 1 year to find the exact purchase date. Return windows of 30 or 90 days can be reverse-calculated the same way — enter the current date and subtract the return window to confirm eligibility."
      },
      {
        title: "For Legal Statute of Limitations",
        content: "Many legal claims must be filed within a specific number of years or days from an incident date. Subtract the statutory period from today to find the earliest claimable date and verify whether a claim is still within its filing window."
      },
      {
        title: "For Medical and Health History",
        content: "Physicians and patients often need to establish when a symptom or treatment began. Subtracting weeks or months from a diagnosis date helps identify onset windows and treatment timelines accurately."
      },
      {
        title: "For Financial Record Lookups",
        content: "Tax filings, audit windows, and financial record retention periods are defined by date ranges counting backward from a reference point. Subtract the required retention period to find the earliest date documents must be kept from."
      }
    ],
    internalLinksText: "To add days forward from a date instead of subtracting, use the Add Days to Date tool. To count the total days between two known dates, use the Days Between Dates Calculator. For working day calculations, the Business Days Calculator excludes weekends automatically.",
    relatedToolSlugs: [
      "add-days-to-date",
      "days-between-dates",
      "business-days-calculator"
    ],
    faqs: [
      {
        question: "What is the difference between subtracting days and subtracting months?",
        answer: "Subtracting days moves backward by exact 24-hour periods. Subtracting months moves backward by calendar months, which vary in length. Subtracting 1 month from March 31st returns February 28th or 29th, not March 2nd or 3rd."
      },
      {
        question: "Can I subtract more than a year?",
        answer: "Yes. The calculator supports subtracting up to 999,999 days or the equivalent in weeks, months, and years — covering thousands of years of historical date calculations."
      },
      {
        question: "Does the calculator handle leap years when subtracting?",
        answer: "Yes. If your calculation crosses a February 29th in a leap year, that day is correctly included or excluded in the count depending on the date range."
      },
      {
        question: "How do I find what date was 90 days ago?",
        answer: "Select today as your start date, enter 90 in the amount field with Days selected as the unit, and read the result date. The breakdown confirms the exact calendar date 90 days before today."
      },
      {
        question: "What if I subtract months from a month-end date?",
        answer: "The calculator uses real calendar month logic. Subtracting 1 month from March 31st returns February 28th or 29th — the last day of February — rather than an invalid date."
      }
    ]
  }
};
