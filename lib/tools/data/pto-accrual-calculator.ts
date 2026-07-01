import { ToolPageData } from "../toolPageData";

export const ptoAccrualCalculatorData: ToolPageData = {
  slug: "pto-accrual-calculator",
  name: "PTO Accrual Calculator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Calculate accumulated Paid Time Off (PTO) based on accrual rates, periods, caps, and planned usages.",
  
  seo: {
    title: "PTO Accrual Calculator | Track Paid Time Off Accumulation",
    metaDescription: "Estimate your accumulated Paid Time Off (PTO) balance over time. Factor in accrual periods, custom limits, caps, and planned usage.",
    introText: "The PTO Accrual Calculator allows employees and human resources professionals to track how paid vacation, sick leave, or personal time accumulates over time. Simply enter your accrual rate, pay periods, current balance, caps, and planned vacation hours to forecast your future PTO balances and check that you don't hit your accrual cap.",
    howToTitle: "How to Calculate PTO Accrual",
    howToSteps: [
      "Enter your accrual rate (e.g., 4.0 hours per pay period).",
      "Select your accrual period (hourly, weekly, pay-period, or monthly).",
      "Enter the hours worked (for hourly accruals) or select the number of periods you want to project.",
      "Input your current PTO balance and your company's maximum accrual cap.",
      "Subtract any planned vacation or time-off hours to see your net projected balance."
    ],
    useCases: [
      {
        title: "Planning Vacation Time",
        content: "Determine if you will accumulate enough PTO hours by a future date (e.g., a planned holiday in 6 months) to cover your trip without unpaid time off."
      },
      {
        title: "Avoiding PTO Accrual Caps",
        content: "Many companies enforce 'use-it-or-lose-it' caps. Use this calculator to see when you will hit your maximum cap, letting you schedule time off to avoid losing earned hours."
      },
      {
        title: "HR Payroll Verification",
        content: "Verify that employee accrual balances on payroll stubs are matching standard hourly contract terms."
      }
    ],
    internalLinksText: "To count total annual working hours excluding paid vacation, check the Annual Work Hours Counter. If you need to plan pay cycle calendars, try the Payroll Period Planner.",
    relatedToolSlugs: [
      "annual-work-hours",
      "payroll-period-planner",
      "furlough-pay-calculator"
    ],
    faqs: [
      {
        question: "What does 'accrual cap' mean?",
        answer: "An accrual cap is the maximum number of PTO hours you are allowed to hold at any one time. Once you reach this cap, you stop accumulating additional time off until you use some of your balance."
      },
      {
        question: "How is PTO calculated on an hourly basis?",
        answer: "For hourly employees, PTO is earned as a fraction of an hour for every hour worked. For example, if you earn 0.05 hours of PTO per work hour, working a standard 40-hour week will accrue 2.0 hours of PTO."
      },
      {
        question: "What happens if my vacation hours exceed my balance?",
        answer: "If your planned usage is greater than your accrued balance, you will have a negative projection. You can use the calculator to determine how many more pay periods are needed before your balance supports your vacation schedule."
      }
    ]
  }
};
