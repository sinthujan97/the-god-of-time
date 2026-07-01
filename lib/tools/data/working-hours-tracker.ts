import { ToolPageData } from "../toolPageData";

export const workingHoursTrackerData: ToolPageData = {
  slug: "working-hours-tracker",
  name: "Working Hours Tracker",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#C5F135",
  description: "Log and calculate the sum of working hours across customized date ranges.",
  
  seo: {
    title: "Working Hours Tracker | Timesheet Calculator",
    metaDescription: "Log and total working hours across multiple shifts. Exclude breaks, calculate overtime, and get average work lengths. Free online timesheet utility.",
    introText: "The Working Hours Tracker is a flexible shift logging calculator that lets you enter multiple start/end times across a two-week period (up to 14 shifts). It compiles a running total of hours worked (in both standard HH:MM and decimal formats), calculates daily or weekly overtime based on adjustable thresholds, and provides average working lengths per day.",
    howToTitle: "How to Track Working Hours",
    howToSteps: [
      "Use 'Add Shift' to insert a new shift row (supports up to 14 rows).",
      "Enter a date, start time, and end time for each shift. Overnight shifts (e.g. clocking in at 10 PM and out at 6 AM) are handled automatically.",
      "Adjust the overtime thresholds (daily or weekly) and select the overtime calculation mode to see regular and overtime hours split at the bottom."
    ],
    useCases: [
      {
        title: "For Freelance and Contract Billing",
        content: "Log individual days worked on client tasks. The tracker outputs decimal summaries, enabling you to multiply total hours directly by your hourly contract rate."
      },
      {
        title: "For Small Business Shift Audits",
        content: "Track employee hours across weekly or bi-weekly pay periods. Auditing regular vs. overtime hours prevents payroll budget errors."
      },
      {
        title: "For Multi-Segment Shift Logs",
        content: "If you work split shifts (e.g., morning and evening blocks on the same day), add each block as a separate row to get a single unified day sum."
      }
    ],
    internalLinksText: "To calculate overtime pay rates and gross earnings, use the Overtime Hours Calculator. To generate structured payroll schedules, use the Payroll Period Planner.",
    relatedToolSlugs: [
      "overtime-hours-calculator",
      "payroll-period-planner",
      "time-duration-calculator"
    ],
    faqs: [
      {
        question: "How does the tracker calculate split shifts?",
        answer: "You can enter multiple rows with the same date. The tracker groups shifts by date behind the scenes to determine total hours worked per day for daily overtime calculations."
      },
      {
        question: "Does the tracker handle shifts that cross midnight?",
        answer: "Yes. If a shift's end time is earlier than its start time, the tracker identifies the midnight crossing and adds 24 hours to that shift's duration to return the correct elapsed work hours."
      },
      {
        question: "Can I export my timesheet logs?",
        answer: "The calculations and summaries update live. You can copy the final summary text to clipboard or take screenshots to save your shift records."
      }
    ]
  }
};
