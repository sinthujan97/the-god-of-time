import { ToolPageData } from "../toolPageData";

export const overtimeHoursCalculatorData: ToolPageData = {
  slug: "overtime-hours-calculator",
  name: "Overtime Hours Calculator",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Calculate regular and overtime working hours based on daily or weekly thresholds.",
  
  seo: {
    title: "Overtime Hours Calculator | Pay & Hours Splitter",
    metaDescription: "Calculate regular vs. overtime hours and compute gross pay. Supports customizable thresholds, hourly rates, and standard multiplier rates (1.5x, 2x).",
    introText: "The Overtime Hours Calculator splits total working hours into regular and overtime allocations based on standard weekly thresholds (e.g. 40 hours) or custom limits. By entering an optional hourly wage and select multiplier rates (like time-and-a-half or double time), it also computes regular pay, overtime pay, and total gross earnings.",
    howToTitle: "How to Calculate Overtime Pay",
    howToSteps: [
      "Enter total hours worked during the week or period.",
      "Enter your standard hourly rate (optional) and the regular hours threshold (defaults to 40 hours).",
      "Select your overtime multiplier (1.5x, 2x, or a custom rate) and read the resulting gross pay and hour breakdown."
    ],
    useCases: [
      {
        title: "For Freelancers Billing Overtime",
        content: "If your client contract stipulates premium rates for work exceeding 40 hours per week, use the calculator to split hours and invoicing rates accurately."
      },
      {
        title: "For Employee Timesheet Audits",
        content: "HR personnel use the calculator to check supervisor logs and verify employee overtime submissions before committing to bank payroll runs."
      },
      {
        title: "For Budget Estimations",
        content: "Estimate project cost scenarios by calculating how premium overtime rates (e.g. 1.5x or 2x) affect total labor costs for late deliverables."
      }
    ],
    internalLinksText: "To log individual shifts and tally hours before calculating overtime pay, use the Working Hours Tracker. To generate payment periods, use the Payroll Period Planner.",
    relatedToolSlugs: [
      "working-hours-tracker",
      "payroll-period-planner",
      "decimal-time-converter"
    ],
    faqs: [
      {
        question: "What is the standard overtime multiplier?",
        answer: "In many jurisdictions, the standard overtime rate is 1.5 times the employee's regular hourly wage (known as time-and-a-half). Some holidays or weekend hours are paid at 2.0 times (double-time)."
      },
      {
        question: "How are overtime hours defined?",
        answer: "Overtime hours represent any work hours exceeding a set threshold (typically 48 hours in some regions, or 40 hours per week in the US and Canada)."
      },
      {
        question: "Can I enter a custom overtime multiplier?",
        answer: "Yes. Toggle the multiplier pill to 'Custom' to input any custom rate (e.g., 1.25x or 1.75x) as required by your employment terms."
      }
    ]
  }
};
