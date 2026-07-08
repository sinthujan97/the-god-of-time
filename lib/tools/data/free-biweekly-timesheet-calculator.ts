import { ToolPageData } from "../toolPageData";

export const freeBiweeklyTimesheetCalculatorData: ToolPageData = {
  slug: "free-biweekly-timesheet-calculator",
  name: "Free Biweekly Timesheet Calculator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Generate a detailed 14-day biweekly timesheet with daily hours, overtime tracking, and payroll subtotals for each week.",

  seo: {
    title: "Free Biweekly Timesheet Calculator | With Overtime",
    metaDescription: "Free biweekly timesheet calculator with overtime. Track 14-day work hours, deduct breaks, calculate weekly overtime, and generate payroll subtotals instantly.",
    introText:
      "This free biweekly timesheet calculator tracks your hours across a full 14-day pay period, calculating regular hours, overtime, break deductions, and gross pay totals for each of the two weeks separately. Biweekly payroll schedules occur every 14 days and produce 26 pay periods per year — the most common pay frequency in the United States, used by over 43% of private sector employers. Enter your shift start and end times, unpaid break minutes, and overtime thresholds for each working day to generate accurate Week 1 and Week 2 subtotals, combined hours, and a payroll-ready summary you can share with your manager or HR team.",
    howToTitle: "How to Use the Biweekly Timesheet Calculator",
    howToSteps: [
      "Select your pay cycle start date to label and sequence the 14 days of the timesheet.",
      "Enter your shift start time, end time, and unpaid break minutes for each working day across both weeks.",
      "Set your daily overtime threshold (commonly 8 hours/day) and weekly overtime threshold (commonly 40 hours/week).",
      "Review the regular hours, overtime hours, week-by-week subtotals, and cumulative 14-day totals — use these figures for payroll submission or invoice preparation."
    ],
    useCases: [
      {
        title: "What Is a Biweekly Timesheet?",
        content:
          "A biweekly timesheet records daily work hours over a 14-day pay cycle — the period between two consecutive biweekly paychecks. Unlike a weekly timesheet that resets every 7 days, a biweekly timesheet accumulates hours across two full weeks before resetting, making it essential for employers who process payroll every other Friday (or any fixed 14-day cycle). Under the Fair Labor Standards Act (FLSA), overtime must be calculated on a workweek basis — each 7-day period independently — not across the full 14-day cycle. This means even on a biweekly pay schedule, Week 1 overtime and Week 2 overtime are calculated separately. This biweekly timesheet calculator applies this FLSA-compliant calculation automatically, ensuring your overtime totals are legally correct for payroll processing."
      },
      {
        title: "Biweekly vs Semi-Monthly Timesheets",
        content:
          "Biweekly and semi-monthly pay schedules both result in approximately two paychecks per month, but they work differently. Biweekly pay runs every 14 days on a fixed cycle — always the same day of the week — producing 26 pay periods per year. Semi-monthly pay runs on fixed calendar dates (such as the 1st and 15th) producing exactly 24 pay periods per year. For timesheets, the key difference is period length: biweekly periods are always exactly 14 days, while semi-monthly periods vary between 15 and 16 days depending on the month. Biweekly timesheets are also simpler for overtime compliance because each week is a consistent 7-day unit. Hourly workers covered under FLSA are more commonly paid biweekly than semi-monthly for this reason."
      }
    ],
    faqs: [
      {
        question: "What is the difference between biweekly and semi-monthly pay?",
        answer:
          "Biweekly pay occurs every 14 days on a fixed schedule (26 times per year), while semi-monthly pay occurs on fixed calendar dates — typically the 1st and 15th (24 times per year). For the same annual salary, biweekly paychecks are slightly smaller but more frequent."
      },
      {
        question: "Does the calculator support overnight shifts?",
        answer:
          "Yes. If your shift end time is earlier than the start time (for example, 11:00 PM to 7:00 AM), the calculator automatically handles the cross-midnight duration and calculates the correct hours for that day."
      },
      {
        question: "How are overtime hours calculated on a biweekly timesheet?",
        answer:
          "Under FLSA rules, overtime is calculated per workweek — not over the entire 14-day period. This calculator applies your weekly overtime threshold (usually 40 hours) to Week 1 and Week 2 independently, then sums the results. A 50-hour Week 1 and 30-hour Week 2 produces 10 overtime hours, not 0."
      },
      {
        question: "Can I enter different hours for each day of the week?",
        answer:
          "Yes. The timesheet has a separate row for each of the 14 days, allowing you to enter different start times, end times, and break durations for every shift. Days where you didn't work can be left empty or set to zero."
      },
      {
        question: "How many pay periods are in a biweekly schedule?",
        answer:
          "A biweekly schedule produces 26 pay periods per year. Two months per year will have three pay dates rather than the usual two, sometimes called a 'three paycheck month.'"
      },
      {
        question: "Can this timesheet be used for payroll submission?",
        answer:
          "Yes. The weekly subtotals and cumulative 14-day totals shown in this calculator match the data your payroll department or HR software needs — regular hours by week, overtime hours by week, and total period hours."
      }
    ],
    internalLinksText:
      "For tracking time against multiple clients, try the Billable Hours Tracker. To calculate semi-monthly pay periods instead, use the Semi Monthly Pay Calculator. To compute overtime pay amounts, see the Overtime Pay Calculator.",
    relatedToolSlugs: [
      "time-card-calculator",
      "payroll-period-planner",
      "overtime-pay-calculator"
    ]
  }
};
