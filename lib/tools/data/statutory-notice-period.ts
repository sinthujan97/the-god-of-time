import { ToolPageData } from "../toolPageData";

export const statutoryNoticePeriodData: ToolPageData = {
  slug: "statutory-notice-period",
  name: "Statutory Notice Period Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#9B8EF5",
  description: "Determine required resignation or termination notice periods and project final employment dates.",
  
  seo: {
    title: "Statutory Notice Period Calculator | Resignation Date Planner",
    metaDescription: "Calculate required employment notice periods and determine final working days based on resignation dates, length of service, and contract terms.",
    introText: "The Statutory Notice Period Calculator helps employers and employees calculate final working dates and exit timelines. Based on the start of employment, the date notice is given, and contractual or statutory rules, the calculator projects the exact final day of employment, total calendar days of notice, and remaining business days to transition work.",
    howToTitle: "How to Calculate Employment Notice Periods",
    howToSteps: [
      "Select your employment start date to establish length of service.",
      "Enter the date notice is officially submitted or received.",
      "Specify notice duration in weeks or days, or use statutory rules based on service length.",
      "Toggle whether outstanding PTO or vacation days will be taken during the notice period.",
      "Review the calculated final date of employment and the number of active transition days."
    ],
    useCases: [
      {
        title: "Employee Resignation Planning",
        content: "Employees resigning from their positions calculate notice periods to align their exit date with a new employer's start date, ensuring no overlap or gap in income."
      },
      {
        title: "Employer Offboarding & Transition",
        content: "HR managers use notice period calculations to structure transition checklists, schedule exit interviews, set up final pay runs, and post recruitment ads for replacements."
      },
      {
        title: "Contractual Termination Disputes",
        content: "Legal counsel references notice calculators to verify compliance with employment contracts or local labor laws regarding minimum statutory warning periods before dismissal."
      }
    ],
    internalLinksText: "To calculate final payouts including PTO cash-out, use the Gross to Net Pay Calculator. For billing overlaps, check the Multi-Job Income Sync. For regular working calendar mapping, try the Business Days Calculator.",
    relatedToolSlugs: [
      "gross-to-net-pay",
      "multi-job-income-sync",
      "business-days-calculator"
    ],
    faqs: [
      {
        question: "What is the difference between statutory and contractual notice?",
        answer: "Statutory notice is the minimum notice period required by law based on length of service. Contractual notice is the notice period agreed upon in the employment contract, which can be longer (but not shorter) than the statutory minimum."
      },
      {
        question: "Can outstanding PTO reduce the notice period?",
        answer: "Outstanding PTO does not technically shorten the notice period itself. However, with employer approval, an employee can take paid leave during their notice period, meaning their last physical day of work is earlier, though the official termination date remains unchanged."
      },
      {
        question: "How are weekends counted in notice periods?",
        answer: "Notice periods are typically calculated in calendar days or full weeks. A 2-week notice period starting on a Wednesday runs for exactly 14 calendar days, ending on the Wednesday two weeks later, regardless of weekends or holidays in between."
      }
    ]
  }
};
