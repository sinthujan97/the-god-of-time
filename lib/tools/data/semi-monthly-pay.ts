import { ToolPageData } from "../toolPageData";

export const semiMonthlyPayData: ToolPageData = {
  slug: "semi-monthly-pay",
  name: "Semi-Monthly Pay Stacker",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#60A5D4",
  description: "Plan pay cycles, estimate gross pay per period, and generate upcoming paydates for twice-a-month schedules.",
  
  seo: {
    title: "Semi-Monthly Pay Stacker | Plan Twice-a-Month Income Cycles",
    metaDescription: "Calculate gross pay per period for twice-a-month schedules. Generate a list of upcoming paydates and check weekend adjustments.",
    introText: "The Semi-Monthly Pay Stacker is designed for employees and payroll teams on twice-a-month pay schedules (usually the 15th and last day of the month). Enter your annual salary or hourly rate to calculate gross pay per period, check upcoming paydates, and see how dates adjust when falling on weekends.",
    howToTitle: "How to Calculate Semi-Monthly Pay Cycles",
    howToSteps: [
      "Select whether you want to calculate based on an Annual Salary or an Hourly Rate.",
      "Enter your pay amount and work hours per week (if hourly).",
      "Specify your first paydate to anchor the payroll timeline.",
      "Review the gross pay per period, annual salary equivalents, and a detailed schedule of upcoming paydates."
    ],
    useCases: [
      {
        title: "Salaried Employees on Semi-Monthly Pay",
        content: "Determine your exact gross paycheck amount and check future payday dates to plan mortgage, bill payments, and savings cycles."
      },
      {
        title: "Transitioning Pay Cycles",
        content: "If your employer is switching from a bi-weekly schedule to a semi-monthly schedule, calculate how your per-paycheck amount will change."
      },
      {
        title: "Payroll Administrators",
        content: "Generate pay dates for the next fiscal period, verifying weekend adjustment rules to ensure employees are paid on time."
      }
    ],
    internalLinksText: "For standard paycycle planning calendars, check the Payroll Period Planner. To generate a 14-day timesheet log, try the Bi-Weekly Timesheet Template Generator.",
    relatedToolSlugs: [
      "payroll-period-planner",
      "biweekly-timesheet",
      "hourly-to-salary"
    ],
    faqs: [
      {
        question: "How many pay periods are in a semi-monthly schedule?",
        answer: "A semi-monthly schedule has exactly 24 pay periods in a year, since payments occur twice a month for 12 months. This is different from a bi-weekly schedule, which has 26 pay periods."
      },
      {
        question: "What is the standard weekend adjustment rule?",
        answer: "If a scheduled pay date (like the 15th or 30th) falls on a Saturday or Sunday, employers typically pay employees on the preceding Friday. The calculator applies this rule automatically and highlights adjusted pay dates."
      },
      {
        question: "How is hourly rate converted to semi-monthly pay?",
        answer: "The hourly rate is first converted to an annual salary equivalent (hourly rate × hours per week × 52 weeks), and then divided by 24 pay periods to find the gross pay per period."
      }
    ]
  }
};
