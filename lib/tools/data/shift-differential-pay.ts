import { ToolPageData } from "../toolPageData";

export const shiftDifferentialPayData: ToolPageData = {
  slug: "shift-differential-pay",
  name: "Shift Differential Pay Tool",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#60A5D4",
  description: "Calculate shift differential earnings using hourly rate premiums, flat rates, or percentage-based bonuses.",
  
  seo: {
    title: "Shift Differential Pay Tool | Calculate Shift Premiums",
    metaDescription: "Estimate your earnings with shift differential rates. Compare flat-rate premiums and percentage bonuses for night, weekend, or holiday shifts.",
    introText: "The Shift Differential Pay Tool helps you calculate your total earnings when working non-standard shifts that qualify for premium pay rates. Whether you receive a flat dollar increase per hour or a percentage bonus on top of your base pay, this tool provides a clear breakdown of your regular earnings, shift premiums, and effective hourly rate.",
    howToTitle: "How to Calculate Shift Differential Pay",
    howToSteps: [
      "Enter your base hourly wage rate (e.g., $18.00 per hour).",
      "Enter the number of hours worked during the differential shift.",
      "Select your shift differential premium type: Flat Rate ($ per hour) or Percentage (%).",
      "Enter the differential premium value (e.g., $2.50 or 15%).",
      "Review your regular earnings, differential earnings, total combined gross pay, and effective hourly rate."
    ],
    useCases: [
      {
        title: "Healthcare Night Shifts",
        content: "Nurses and hospital workers who work evening, night, or weekend shifts can calculate their shift premium additions to ensure their paycheck details are correct."
      },
      {
        title: "Manufacturing & Retail Operations",
        content: "Workers on swing shifts, graveyard shifts, or holiday hours can compare different shift differential rates when selecting shift preferences."
      },
      {
        title: "HR and Scheduling Managers",
        content: "Estimate shift differential budgets when planning staffing levels for overnight schedules, weekend operations, or emergency coverage."
      }
    ],
    internalLinksText: "To track daily shift start and end times, try the Time Card Calculator. To calculate standard weekly overtime splits, use the Overtime Pay Calculator.",
    relatedToolSlugs: [
      "time-card-calculator",
      "overtime-pay-calculator",
      "gross-to-net-pay"
    ],
    faqs: [
      {
        question: "What is a shift differential?",
        answer: "A shift differential is extra pay offered to employees who work less desirable hours, such as night shifts, evening shifts, weekend shifts, or public holidays. The differential is added to the employee's standard base hourly wage."
      },
      {
        question: "How is percentage-based differential calculated?",
        answer: "A percentage-based differential multiplies your base hourly rate by the percentage premium, then multiplies by the shift hours. For example, a 10% premium on a $20.00 base rate adds $2.00 per hour, making your shift rate $22.00 per hour."
      },
      {
        question: "Is shift differential pay subject to overtime rates?",
        answer: "Under FLSA rules, shift differentials must be included in the employee's 'regular rate of pay' when calculating overtime. This means if you work overtime during a shift with a differential, your overtime rate (1.5x) is based on the base rate plus the differential rate."
      }
    ]
  }
};
