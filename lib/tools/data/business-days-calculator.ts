import { ToolPageData } from "../toolPageData";

export const businessDaysCalculatorData: ToolPageData = {
  slug: "business-days-calculator",
  name: "Business Days Calculator",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Count the exact number of working days between two dates, excluding Saturdays and Sundays.",
  
  seo: {
    title: "Business Days Calculator | Working Days Counter",
    metaDescription: "Count business days between two dates instantly. Excludes weekends automatically. Free working days calculator for deadlines, contracts, and project timelines.",
    introText: "The Business Days Calculator counts the exact number of working days between any two dates, automatically excluding Saturdays and Sundays. Use it for contract notice periods, project delivery timelines, procurement lead times, and any deadline that specifies business days rather than calendar days. For calculations that also need to exclude public holidays, use the Business Days with Holidays tool.",
    howToTitle: "How to Count Business Days Between Two Dates",
    howToSteps: [
      "Select your start date — the first day of the period. If your start date falls on a weekend it is not counted as a business day.",
      "Select your end date. The calculator counts every Monday through Friday between the two dates, excluding both Saturday and Sunday from the total.",
      "Read the business day count. The breakdown shows the total calendar days in the range and exactly how many weekend days were excluded from the count."
    ],
    useCases: [
      {
        title: "For Contract Notice Periods",
        content: "Employment contracts, service agreements, and lease terminations frequently specify notice periods in business days. A 20 business day notice period starting on a Monday ends 4 calendar weeks later on a Friday — but starting on a Wednesday adds extra days from the split week."
      },
      {
        title: "For Payment Terms and Invoice Deadlines",
        content: "Net-30 and Net-60 payment terms in business invoicing typically mean 30 or 60 business days from invoice date. Knowing the exact calendar date those terms expire prevents late payment penalties and cash flow gaps."
      },
      {
        title: "For Regulatory and Compliance Windows",
        content: "Government agencies and regulators define response and filing windows in business days. Counting calendar days on a compliance deadline risks missing the actual cutoff by days if weekends fall within the window."
      },
      {
        title: "For HR and Recruitment Timelines",
        content: "Hiring processes, probation periods, and performance improvement plans are frequently measured in business days. A 90-day probation starting on a Monday spans more calendar days than one starting mid-week due to weekend distribution."
      }
    ],
    internalLinksText: "To also exclude public holidays from your count, use the Business Days with Holidays Calculator. To count all calendar days including weekends, use the Days Between Dates Calculator. For calculating exact delivery dates from today, use the Add Days to Date tool.",
    relatedToolSlugs: [
      "business-days-with-holidays",
      "days-between-dates",
      "add-days-to-date"
    ],
    faqs: [
      {
        question: "Does the calculator include the start and end dates as business days?",
        answer: "The start date is included if it falls on a weekday. The end date is not included by default — it measures the gap between the two dates. If your contract or legal document requires inclusive counting, add 1 to the result."
      },
      {
        question: "What counts as a business day?",
        answer: "This calculator defines business days as Monday through Friday. It does not exclude public or bank holidays. For holiday-aware calculations use the Business Days with Holidays tool."
      },
      {
        question: "How many business days are in a month?",
        answer: "Most calendar months contain between 20 and 23 business days depending on how weekends fall. February in a standard year has 20 business days. Months with 31 days that start on Monday have 23."
      },
      {
        question: "Does it matter what day of the week I start on?",
        answer: "Yes. Starting on different weekdays changes how many weekends fall within a fixed-length period. A 30-calendar-day period starting on Monday contains 22 business days while one starting on Wednesday contains 20."
      },
      {
        question: "Can I calculate business days across years?",
        answer: "Yes. The calculator handles any date range regardless of length including ranges that cross year boundaries. Business day counts remain accurate across multiple years."
      }
    ]
  }
};
