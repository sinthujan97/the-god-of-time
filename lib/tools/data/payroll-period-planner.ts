import { ToolPageData } from "../toolPageData";

export const payrollPeriodPlannerData: ToolPageData = {
  slug: "payroll-period-planner",
  name: "Payroll Period Planner",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Generate and review dates for standard weekly, bi-weekly, or monthly pay cycles.",
  
  seo: {
    title: "Payroll Period Planner | Pay Cycle Calendar Generator",
    metaDescription: "Generate a table of upcoming pay dates and pay periods. Supports weekly, bi-weekly, semi-monthly, and monthly pay cycles with weekend adjustments.",
    introText: "The Payroll Period Planner generates structured calendars of upcoming pay dates, period start dates, and period end dates based on pay frequencies. It adjusts pay dates that fall on weekends (e.g. moving a Saturday or Sunday pay date back to Friday) and allows exporting schedules directly into spreadsheets.",
    howToTitle: "How to Generate Pay Period Calendars",
    howToSteps: [
      "Select your pay frequency (Weekly, Bi-Weekly, Semi-Monthly, or Monthly).",
      "Pick your first pay date using the calendar date picker.",
      "Specify the number of periods to generate (from 1 to 26) and read the resulting cycle table.",
      "Use the 'Copy Table' button to export results into Excel or Google Sheets."
    ],
    useCases: [
      {
        title: "For Corporate Financial Calendar Setup",
        content: "Accountants and HR personnel use the generator to map out fiscal year calendars, defining period boundaries and payday reminders for the entire staff."
      },
      {
        title: "For Employee Personal Budgeting",
        content: "Employees can map out exact pay dates for upcoming months, aligning mortgage payments, credit card bills, and savings contributions with cash inflows."
      },
      {
        title: "For Freelance Client Scheduling",
        content: "Setup recurring invoice dates (e.g. bi-weekly or monthly billings) for client accounts to establish predictable payment cycle intervals."
      }
    ],
    internalLinksText: "To track daily shift hours before exporting to payroll, use the Working Hours Tracker. To calculate regular and overtime wage splits, use the Overtime Hours Calculator.",
    relatedToolSlugs: [
      "working-hours-tracker",
      "overtime-hours-calculator",
      "decimal-time-converter"
    ],
    faqs: [
      {
        question: "How are weekend paydays handled?",
        answer: "If a generated pay date falls on a Saturday or Sunday, the planner automatically shifts the payday back to the preceding Friday (weekend adjustment) and flags it in the notes column."
      },
      {
        question: "What is the difference between bi-weekly and semi-monthly cycles?",
        answer: "Bi-weekly pay occurs every 2 weeks (26 times a year, meaning some months have 3 paydays). Semi-monthly pay occurs twice a month (typically on the 15th and last day of the month, resulting in 24 paydays a year)."
      },
      {
        question: "How do I import the generated periods into Excel?",
        answer: "Click the 'Copy Table' button at the bottom of the calculator. This copies the calendar grid as tab-separated values (TSV), which can be pasted directly into Excel or Google Sheets."
      }
    ]
  }
};
