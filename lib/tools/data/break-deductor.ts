import { ToolPageData } from "../toolPageData";

export const breakDeductorData: ToolPageData = {
  slug: "break-deductor",
  name: "Daily Break Deductor Tool",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#60A5D4",
  description: "Deduct lunch and rest breaks from your total hours, applying paid break allowances dynamically.",
  
  seo: {
    title: "Daily Break Deductor Tool | Subtract Unpaid Break Time",
    metaDescription: "Easily subtract lunch and rest breaks from total work hours. Apply paid break allowances to calculate your net paid working hours.",
    introText: "The Daily Break Deductor Tool is a simple utility to calculate net paid working hours. It is designed to take your total hours, the number of breaks you took, and their duration, and apply your company's paid break allowance to compute the exact unpaid break deduction and remaining net hours.",
    howToTitle: "How to Deduct Breaks from Work Hours",
    howToSteps: [
      "Enter your total scheduled hours for the day or week (e.g., 8.5 hours).",
      "Enter the number of breaks you took during this period.",
      "Input the average duration of each break in minutes (e.g., 15 or 30 minutes).",
      "Specify your paid break allowance in minutes (the amount of break time that remains paid).",
      "Read your total break duration, unpaid break deduction, and final net working hours."
    ],
    useCases: [
      {
        title: "Standard Shift Work",
        content: "If you work an 8.5-hour shift and take one 30-minute unpaid lunch break, use this tool to verify your net paid hours equal exactly 8.0."
      },
      {
        title: "Retail and Customer Service",
        content: "Employees taking multiple short rest periods can calculate how much break time was unpaid under local labor laws."
      },
      {
        title: "Freelancers and Billing",
        content: "Subtract personal breaks and lunches from your total logged work sessions to ensure you only bill clients for active work."
      }
    ],
    internalLinksText: "For complete weekly timecard logs, check the Time Card Calculator. For shifts with multiple break entries, use the Multi-Break Time Card Tool.",
    relatedToolSlugs: [
      "time-card-calculator",
      "time-card-with-breaks",
      "annual-work-hours"
    ],
    faqs: [
      {
        question: "How does a paid break allowance reduce deductions?",
        answer: "The paid break allowance is subtracted from your total break duration. Only the remaining break minutes are treated as unpaid and deducted from your gross hours. For example, if you take 40 minutes of breaks and have a 20-minute paid allowance, only 20 minutes of unpaid breaks are deducted."
      },
      {
        question: "What is a standard unpaid lunch break duration?",
        answer: "A standard unpaid lunch break is typically 30 or 60 minutes for shifts exceeding 6 hours, depending on regional labor regulations and company agreements."
      },
      {
        question: "Does this support decimals for total hours?",
        answer: "Yes, you can enter total hours as decimals (e.g., 38.5 hours) to calculate weekly timesheet break deductions."
      }
    ]
  }
};
