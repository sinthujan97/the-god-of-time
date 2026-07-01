import { ToolPageData } from "../toolPageData";

export const grossToNetPayData: ToolPageData = {
  slug: "gross-to-net-pay",
  name: "Gross-to-Net Time Pay Sheet",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Estimate your net take-home pay after standard hours, taxes, and other payroll deductions.",
  
  seo: {
    title: "Gross-to-Net Pay Calculator | Estimate Take-Home Pay",
    metaDescription: "Estimate your actual take-home paycheck. Input gross earnings, federal and state tax rates, Medicare, Social Security, and health insurance deductions.",
    introText: "The Gross-to-Net Pay Calculator estimates your net take-home pay by subtracting tax withholdings and deductions from your gross earnings. It models federal income tax, state income tax, FICA (Social Security and Medicare), and other pre-tax or post-tax deductions, giving you a clear view of your actual disposable income.",
    howToTitle: "How to Estimate Your Net Take-Home Pay",
    howToSteps: [
      "Enter your gross salary or hourly earnings for the pay period (e.g., $3,000).",
      "Specify your estimated federal income tax rate (e.g., 12%) and state tax rate (e.g., 4%).",
      "Set your FICA tax rate (default is 7.65% for standard Social Security and Medicare employee shares).",
      "Add any other deductions, such as health insurance premiums, 401(k) contributions, or retirement plans.",
      "Review the breakdown of deductions and your final estimated net take-home pay."
    ],
    useCases: [
      {
        title: "Personal Budget Planning",
        content: "Estimate your exact net monthly income before starting a new job, helping you budget for fixed costs like rent, groceries, loans, and savings."
      },
      {
        title: "Analyzing Tax Adjustments",
        content: "Forecast how changes in your federal withholding or state tax status will affect your weekly pay checks and annual disposable cash."
      },
      {
        title: "Adjusting Retirement Contributions",
        content: "Determine how increasing your pre-tax 401(k) or health savings account (HSA) deductions will lower your take-home pay relative to tax savings."
      }
    ],
    internalLinksText: "To calculate gross overtime earnings before taxes, try the Overtime Pay Calculator. To convert hourly pay rates to annual salaries, use the Hourly to Salary Converter.",
    relatedToolSlugs: [
      "overtime-pay-calculator",
      "hourly-to-salary",
      "furlough-pay-calculator"
    ],
    faqs: [
      {
        question: "What is FICA tax?",
        answer: "FICA stands for the Federal Insurance Contributions Act. It is a mandatory US payroll tax that funds Social Security (6.2%) and Medicare (1.45%), totaling 7.65% for employees. Employers match this same rate."
      },
      {
        question: "What is the difference between pre-tax and post-tax deductions?",
        answer: "Pre-tax deductions (like standard health insurance, HSA, or traditional 401k) are subtracted from your gross earnings before taxes are computed, which lowers your taxable income. Post-tax deductions are subtracted after tax calculations and do not reduce your tax burden."
      },
      {
        question: "How accurate is this net pay estimate?",
        answer: "This tool provides a simplified projection based on flat rates you enter. Actual payroll distributions account for progressive tax brackets, tax allowances, filing statuses (single vs. joint), local county taxes, and standard state brackets, so your actual pay stub may vary slightly."
      }
    ]
  }
};
