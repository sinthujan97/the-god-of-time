import { ToolPageData } from "../toolPageData";

export const furloughPayCalculatorData: ToolPageData = {
  slug: "furlough-pay-calculator",
  name: "Furlough Pay Impact Calculator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#60A5D4",
  description: "Calculate the monthly and total financial impact of unpaid leaves, furlough days, or temporary work suspensions.",
  
  seo: {
    title: "Furlough Pay Impact Calculator | Estimate Income Reductions",
    metaDescription: "Understand the financial impact of unpaid furlough days or temporary layoffs. Calculate loss of income and equivalent adjusted annual pay.",
    introText: "The Furlough Pay Impact Calculator helps salaried and hourly employees understand the financial consequences of furlough periods or temporary unpaid leaves. If you are facing a reduced schedule or temporary work suspension, enter your base pay and furlough details to project your adjusted income, total earnings loss, and equivalent annual run rate.",
    howToTitle: "How to Calculate Furlough Pay Impact",
    howToSteps: [
      "Enter your base annual salary (e.g., $75,000).",
      "Specify the number of unpaid furlough days you are required to take per month (e.g., 2 days).",
      "Enter the duration of the furlough program in months (e.g., 6 months).",
      "Input the average number of work days in a month (standard is 21.67 days).",
      "Review the total lost income, adjusted monthly salary, and adjusted annual salary equivalent."
    ],
    useCases: [
      {
        title: "Facing Corporate Reductions",
        content: "Employees facing cost-cutting programs can calculate exactly how much their monthly paycheck will decrease, helping them adjust their household budgets accordingly."
      },
      {
        title: "Comparing Furloughs vs. Pay Cuts",
        content: "Evaluate whether a temporary furlough (e.g., 1 day off per week for 3 months) is financially preferable to a permanent flat percentage wage cut."
      },
      {
        title: "HR Cost-Savings Analysis",
        content: "Employers can model labor cost savings from potential furlough programs to avoid permanent layoffs while balancing corporate budget sheets."
      }
    ],
    internalLinksText: "To estimate your net take-home pay check after furlough reductions, use our Gross-to-Net Time Pay Sheet. To convert annual salary to hourly rates, try the Salary to Hourly Calculator.",
    relatedToolSlugs: [
      "gross-to-net-pay",
      "salary-to-hourly",
      "pto-accrual-calculator"
    ],
    faqs: [
      {
        question: "What is a furlough?",
        answer: "A furlough is a temporary, mandatory unpaid leave of absence from work, usually implemented by employers to reduce labor costs. Unlike laid-off workers, furloughed employees typically retain their benefits and are expected to return to their jobs once the furlough period ends."
      },
      {
        question: "How is the daily pay rate determined for salaried employees?",
        answer: "For salary conversions, the daily rate is typically computed by dividing the annual salary by the total number of working days in a year (e.g., $75,000 / 260 standard workdays = $288.46 per day). This calculator uses a monthly-based workday divisor for month-by-month precision."
      },
      {
        question: "Does the calculator account for tax differences during furloughs?",
        answer: "This tool calculates gross pay impacts. Since your overall income is lower, your tax bracket or effective tax rate may also decrease, meaning your net take-home pay might be slightly higher than a simple deduction of gross losses."
      }
    ]
  }
};
