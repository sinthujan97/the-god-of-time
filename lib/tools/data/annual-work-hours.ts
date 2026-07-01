import { ToolPageData } from "../toolPageData";

export const annualWorkHoursData: ToolPageData = {
  slug: "annual-work-hours",
  name: "Annual Work Hours Counter",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Calculate gross and net annual working hours, subtracting vacation weeks and public holidays.",
  
  seo: {
    title: "Annual Work Hours Counter | Calculate Net Yearly Hours",
    metaDescription: "Determine the exact number of working hours in a year. Subtract paid time off (PTO), vacation weeks, and public holidays from gross annual schedules.",
    introText: "The Annual Work Hours Counter helps businesses, HR managers, and employees determine the exact number of work hours in a full calendar year. By entering daily shift lengths, weekly workdays, and annual PTO or public holiday allowances, you can instantly see your net yearly working hours and days, and check what percentage of the calendar year is spent working.",
    howToTitle: "How to Count Annual Working Hours",
    howToSteps: [
      "Enter the average hours you work per day (typically 8.0 hours).",
      "Enter the number of workdays per week (typically 5 days).",
      "Input the number of weeks in a year (standard is 52 weeks).",
      "Enter the annual weeks of Paid Time Off (PTO) or vacation you receive.",
      "Input the number of public holidays your organization observes annually (e.g., 10 days).",
      "Review the total gross annual hours, PTO hours, holiday hours, and remaining net working hours/days."
    ],
    useCases: [
      {
        title: "Corporate Labor Budgeting",
        content: "Finance and HR managers calculate net annual work hours to estimate salary allocations, project timelines, and determine hourly cost equivalents for FTE employees."
      },
      {
        title: "Evaluating Job Compensation",
        content: "Compare salary offers with different PTO packages. A role with more vacation weeks has fewer working hours, increasing the effective value of your working hours."
      },
      {
        title: "Resource Planning and Capacity",
        content: "Project managers use annual working hour limits to plan milestones and allocate resources across long-term multi-month initiatives."
      }
    ],
    internalLinksText: "To convert annual salary figures into hourly rates, check the Salary to Hourly Calculator. To track PTO accumulation over time, try the PTO Accrual Calculator.",
    relatedToolSlugs: [
      "salary-to-hourly",
      "payroll-period-planner",
      "pto-accrual-calculator"
    ],
    faqs: [
      {
        question: "How many working hours are in a standard year?",
        answer: "For a standard 40-hour work week over 52 weeks, there are 2,080 gross working hours in a year. Subtracting 2 weeks of vacation (80 hours) and 10 public holidays (80 hours) leaves 1,920 net working hours."
      },
      {
        question: "Why is 'percentage of year spent working' calculated?",
        answer: "A calendar year has 8,760 total hours (24 hours × 365 days). Calculating the percentage spent working shows that a standard 2,080-hour work schedule accounts for only about 23.7% of the total year, helping put work-life balances in perspective."
      },
      {
        question: "How do leap years affect annual work hours?",
        answer: "Leap years add one calendar day (February 29th). If this day falls on a weekday, it adds 8 working hours to the year, increasing the total workdays from 260 to 261. You can adjust the weeks per year or holidays to account for this."
      }
    ]
  }
};
