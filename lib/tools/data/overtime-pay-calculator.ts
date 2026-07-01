import { ToolPageData } from "../toolPageData";

export const overtimePayCalculatorData: ToolPageData = {
  slug: "overtime-pay-calculator",
  name: "Overtime Pay Calculator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Calculate regular pay, overtime pay (1.5x), and double-time pay (2x) based on hourly rates and custom thresholds.",
  
  seo: {
    title: "Overtime Pay Calculator | Calculate Overtime and Double-Time Wages",
    metaDescription: "Easily estimate your gross weekly earnings including regular hours, 1.5x overtime, and 2x double-time rates. Free wage calculator for employees and employers.",
    introText: "The Overtime Pay Calculator helps you calculate your total weekly earnings, including regular pay, overtime (typically 1.5x regular rate), and double-time (typically 2x regular rate). Simply enter your hourly pay rate, total hours worked, and overtime thresholds to instantly view your gross pay, effective hourly rate, and earnings breakdown.",
    howToTitle: "How to Calculate Overtime and Double-Time Pay",
    howToSteps: [
      "Enter your base hourly wage rate (e.g., $20.00 per hour).",
      "Enter the total number of hours worked during the week or pay period.",
      "Specify your regular overtime threshold (standard is 40 hours) and multiplier (standard is 1.5x).",
      "Toggle double-time on if applicable, specifying the threshold (e.g., 50 hours) and multiplier (standard is 2.0x).",
      "Review the total gross pay, regular pay, overtime pay, and effective hourly rate in the results section."
    ],
    useCases: [
      {
        title: "For Hourly Workers",
        content: "Determine how much extra income you earned during weeks with high overtime hours, checking that your gross pay matches payroll distributions."
      },
      {
        title: "For Freelancers and Contractors",
        content: "Calculate billing amounts for projects that require rush rates or weekend hours beyond standard contract limits."
      },
      {
        title: "For Managers and Payroll Admins",
        content: "Quickly verify wages for employees with varied overtime hours without manual arithmetic, ensuring standard FLSA compliance."
      }
    ],
    internalLinksText: "To calculate total daily or weekly hours before entering them here, try the Time Card Calculator. If your shifts involve evening or holiday premiums, check out the Shift Differential Pay Tool.",
    relatedToolSlugs: [
      "time-card-calculator",
      "shift-differential-pay",
      "gross-to-net-pay"
    ],
    faqs: [
      {
        question: "What is the standard overtime pay rate?",
        answer: "In the United States and many other countries, the standard overtime rate is 1.5 times the employee's regular hourly wage (often called time-and-a-half) for any hours worked over 40 in a single workweek."
      },
      {
        question: "What is double-time pay?",
        answer: "Double-time pay is a rate of pay equal to twice the regular hourly rate. It is sometimes required by state labor laws (like California for work exceeding 12 hours in a workday or after 8 hours on the 7th consecutive workday) or offered voluntarily for holidays or weekend shifts."
      },
      {
        question: "What is the 'effective hourly rate'?",
        answer: "The effective hourly rate is your total gross pay divided by the total hours worked. Since overtime hours are paid at a higher rate, your effective hourly rate will be higher than your base rate whenever you work overtime."
      }
    ]
  }
};
