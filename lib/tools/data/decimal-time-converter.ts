import { ToolPageData } from "../toolPageData";

export const decimalTimeConverterData: ToolPageData = {
  slug: "decimal-time-converter",
  name: "Decimal Time Converter",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Convert standard hours and minutes into decimal format and vice versa.",
  
  seo: {
    title: "Decimal Time Converter | Hours and Minutes to Decimals",
    metaDescription: "Convert standard time (hours & minutes) into decimal hours for payroll or convert decimal time back to standard clock formats. Free payroll conversion tables.",
    introText: "The Decimal Time Converter simplifies timesheet logging and payroll invoicing by converting between standard clock hours/minutes (HH:MM) and decimal hours. Since billing rates and payroll databases require decimal format (e.g. 7.5 hours instead of 7 hours and 30 minutes), this free converter helps you perform calculations instantly in both directions.",
    howToTitle: "How to Convert Time to Decimals",
    howToSteps: [
      "Select 'To Decimal' tab if you have hours and minutes and need a decimal number.",
      "Select 'From Decimal' tab if you have a decimal number and need standard hours and minutes.",
      "Enter your numbers and view the conversion result instantly. Refer to the common conversions table below for quick reference."
    ],
    useCases: [
      {
        title: "For Invoicing and Hourly Rates",
        content: "Multiply hours directly by your billing rate. If you worked 4 hours and 15 minutes, entering 4:15 converts to 4.25 decimal hours, allowing you to multiply by your hourly rate (e.g., 4.25 × $50 = $212.50) without errors."
      },
      {
        title: "For Payroll Timesheet Logging",
        content: "HR managers and accountants frequently need to translate employee punch logs into decimal values. This tool outputs standard decimal values instantly, streamlining data entry."
      },
      {
        title: "For Project Task Allocations",
        content: "Express project milestone budgets in decimals to easily calculate percentage consumption or model tasks inside spreadsheets."
      }
    ],
    internalLinksText: "To calculate the exact time duration elapsed between two times before converting to decimal, use the Time Duration Calculator. For multi-shift logs, the Working Hours Tracker performs these conversions automatically.",
    relatedToolSlugs: [
      "time-duration-calculator",
      "working-hours-tracker",
      "add-subtract-time"
    ],
    faqs: [
      {
        question: "How do you calculate decimal time manually?",
        answer: "To convert minutes to a decimal, divide the number of minutes by 60. For example, 45 minutes is 45 / 60 = 0.75. To convert back, multiply the decimal fraction by 60. E.g., 0.5 hours is 0.5 × 60 = 30 minutes."
      },
      {
        question: "What is the decimal equivalent of 15, 30, and 45 minutes?",
        answer: "15 minutes converts to 0.25 hours, 30 minutes converts to 0.5 hours, and 45 minutes converts to 0.75 hours. These are standard increments in payroll systems."
      },
      {
        question: "How many decimal places does this tool use?",
        answer: "The tool rounds decimal hours to 4 decimal places for accuracy, preventing rounding discrepancies when totaling payroll periods."
      }
    ]
  }
};
