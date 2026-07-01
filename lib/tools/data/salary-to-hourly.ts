import { ToolPageData } from "../toolPageData";

export const salaryToHourlyData: ToolPageData = {
  slug: "salary-to-hourly",
  name: "Salary to Hourly Calculator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Convert an annual salary into equivalent gross and net hourly rates, daily rates, and weekly pay.",
  
  seo: {
    title: "Salary to Hourly Calculator | Convert Salary to Hourly Rate",
    metaDescription: "Convert your annual salary to an hourly wage. Calculate gross and net hourly rates based on work hours, holidays, and paid time off (PTO).",
    introText: "The Salary to Hourly Calculator reverses standard salary figures into hourly pay rates. It calculates both your gross hourly rate (assuming standard work hours) and your net hourly rate (accounting for unpaid holidays and paid time off), helping you understand the real value of your time on an hourly basis.",
    howToTitle: "How to Convert Salary to Hourly Wage",
    howToSteps: [
      "Enter your annual salary (e.g., $60,000).",
      "Input the number of hours you work per week (typically 40 hours).",
      "Specify the number of working weeks in a year (standard is 52).",
      "Enter the number of weeks of paid time off (PTO/vacation/holidays) you receive to compute your net hourly rate.",
      "Review your gross hourly rate, net hourly rate, daily rate, and weekly rate equivalents."
    ],
    useCases: [
      {
        title: "Negotiating Hourly Pay",
        content: "If you are transitioning from a full-time salaried employee to a contractor or freelancer, use this tool to calculate what hourly rate you need to charge to maintain your current income level."
      },
      {
        title: "Evaluating Overtime Value",
        content: "Hourly conversions help salaried workers realize the value of their time, giving them a base rate to evaluate whether overtime work is financially worthwhile."
      },
      {
        title: "HR Standardizing Pay scales",
        content: "Human resources teams can easily map annual corporate salary grades to corresponding hourly shift rates for timesheet calculations."
      }
    ],
    internalLinksText: "To convert an hourly wage back to salary equivalents, use the Hourly to Salary Converter. To calculate net yearly work hours excluding vacation, try the Annual Work Hours Counter.",
    relatedToolSlugs: [
      "hourly-to-salary",
      "annual-work-hours",
      "gross-to-net-pay"
    ],
    faqs: [
      {
        question: "What is the difference between gross and net hourly rates?",
        answer: "The gross hourly rate divides your annual salary by all scheduled work hours in the year. The net hourly rate subtracts paid time off (PTO) and holidays from those weeks, showing the actual hourly value of the active working hours you spend on the job."
      },
      {
        question: "How is the daily rate calculated?",
        answer: "The daily rate is calculated by dividing the annual salary by the total number of work weeks times 5 (assuming a standard 5-day workweek), which matches how standard payroll services calculate a day's salary."
      },
      {
        question: "How does a 40-hour work week translate to annual hours?",
        answer: "A standard 40-hour work week over 52 weeks equals 2,080 working hours in a year. Dividing an annual salary of $52,000 by 2,080 hours yields a gross hourly rate of exactly $25.00."
      }
    ]
  }
};
