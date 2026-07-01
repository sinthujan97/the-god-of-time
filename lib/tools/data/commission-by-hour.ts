import { ToolPageData } from "../toolPageData";

export const commissionByHourData: ToolPageData = {
  slug: "commission-by-hour",
  name: "Commission-by-Hour Matrix",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Convert sales commissions into hourly rate equivalents and evaluate combined compensation structures.",
  
  seo: {
    title: "Commission-by-Hour Matrix | Calculate Hourly Sales Incentives",
    metaDescription: "Calculate the hourly value of your sales commissions. Combine base salary and commissions to find your true hourly compensation.",
    introText: "The Commission-by-Hour Matrix converts lump-sum sales commissions into hourly rates. By mapping your commission income against work hours, and integrating your base salary, this tool helps sales professionals, recruiters, and managers evaluate the true hourly worth of commissions and determine break-even structures.",
    howToTitle: "How to Calculate Commission on an Hourly Basis",
    howToSteps: [
      "Enter the total commission amount earned during the period (e.g., $1,500).",
      "Enter the total number of hours worked to earn that commission (e.g., 80 hours).",
      "Enter your base salary for the period (e.g., $2,000) and the standard hours associated with that base salary (e.g., 80 hours).",
      "Review your commission rate per hour, base hourly rate, combined hourly rate, and the commission percentage breakdown."
    ],
    useCases: [
      {
        title: "For Sales Professionals",
        content: "Evaluate your actual hourly earnings during high-performing vs. low-performing months to assess the stability of your commission-only or base-plus-commission compensation."
      },
      {
        title: "For Recruitment and Hiring Managers",
        content: "Structure sales packages by understanding what level of commission payout is required to attract candidates seeking specific hourly target earnings."
      },
      {
        title: "Comparing Job Offers",
        content: "Compare a job offering a high base salary with one offering a lower base but high commission potential by standardizing both to a combined hourly rate."
      }
    ],
    internalLinksText: "To translate regular hourly wages into salary equivalents, use the Hourly to Salary Converter. For calculating shift differential premiums, try our Shift Differential Pay Tool.",
    relatedToolSlugs: [
      "hourly-to-salary",
      "salary-to-hourly",
      "shift-differential-pay"
    ],
    faqs: [
      {
        question: "What is a 'combined hourly rate'?",
        answer: "The combined hourly rate is your total earnings (base salary plus earned commissions) divided by the total hours worked during the pay period. It shows your true hourly rate of compensation."
      },
      {
        question: "What does 'break-even hours' mean in sales?",
        answer: "Break-even hours show how many hours you must work at your commission-only rate to equal your base salary, indicating how self-sustaining your sales incentives are."
      },
      {
        question: "Can this calculate commissions for different commission splits?",
        answer: "Yes. Simply input the final commission payout you receive, and it will compute the hourly value relative to the hours worked, regardless of the split percentage."
      }
    ]
  }
};
