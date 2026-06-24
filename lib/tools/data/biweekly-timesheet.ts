import { ToolPageData } from "../toolPageData";

export const biweeklyTimesheetData: ToolPageData = {
  slug: "biweekly-timesheet",
  name: "Bi-Weekly Timesheet Template Generator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#60A5D4",
  description: "Generate a detailed 14-day bi-weekly time card, tracking start and end times, lunch breaks, and overtime subtotals.",
  
  seo: {
    title: "Bi-Weekly Timesheet Generator | Calculate 14-Day Shift Logs",
    metaDescription: "Calculate weekly and bi-weekly work hours with our 14-day timesheet generator. Deduct breaks, track daily overtime, and compute payroll totals.",
    introText: "The Bi-Weekly Timesheet Template Generator provides a 14-day timecard system for tracking work hours over a standard two-week pay cycle. Input shift start/end times and break durations for each day to generate week 1 subtotals, week 2 subtotals, and total combined hours, simplifying calculations for employees and payroll managers.",
    howToTitle: "How to Generate a Bi-Weekly Timesheet",
    howToSteps: [
      "Select your pay cycle start date to label the days in the timesheet.",
      "Enter your start time, end time, and unpaid break minutes for each working day in Week 1 and Week 2.",
      "Specify daily and weekly overtime thresholds (such as 8 hours/day and 40 hours/week).",
      "Review the regular and overtime hour breakdowns, week-by-week subtotals, and cumulative results."
    ],
    useCases: [
      {
        title: "Bi-Weekly Hourly Employees",
        content: "Track your shift hours over the entire 14-day payroll cycle, ensuring your breaks are correctly deducted and overtime splits match pay stubs."
      },
      {
        title: "Small Business Payroll Management",
        content: "Easily collect and calculate employee work hours for standard bi-weekly schedules (26 pay periods per year) without complex spreadsheet errors."
      },
      {
        title: "Long-Term Contract Billing",
        content: "Prepare clean bi-weekly billing summaries for clients to document active project hours and speed up payments."
      }
    ],
    internalLinksText: "For standard 7-day timesheets, use the Time Card Calculator. To plan upcoming paydate schedules, check the Payroll Period Planner.",
    relatedToolSlugs: [
      "time-card-calculator",
      "payroll-period-planner",
      "overtime-pay-calculator"
    ],
    faqs: [
      {
        question: "What is the difference between bi-weekly and semi-monthly timesheets?",
        answer: "Bi-weekly timesheets follow a strict 14-day cycle (occurring 26 times a year), while semi-monthly timesheets align with twice-a-month schedules, usually matching the 1st-15th and 16th-end of the month (occurring 24 times a year)."
      },
      {
        question: "Does this support overnight shifts?",
        answer: "Yes. If your shift end time is earlier than the start time (e.g. 11:00 PM to 7:00 AM), the generator automatically handles the cross-midnight duration."
      },
      {
        question: "Are overtime thresholds applied per week or over the whole 14 days?",
        answer: "Under standard US labor laws (FLSA), overtime is calculated weekly. This tool applies weekly overtime thresholds (typically 40 hours) to Week 1 and Week 2 individually before summing them up, ensuring compliance with standard labor rules."
      }
    ]
  }
};
