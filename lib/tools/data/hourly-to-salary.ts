import { ToolPageData } from "../toolPageData";

export const hourlyToSalaryData: ToolPageData = {
  slug: "hourly-to-salary",
  name: "Hourly to Salary Converter",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Convert an hourly wage into equivalent weekly, bi-weekly, semi-monthly, monthly, and annual salaries.",
  
  seo: {
    title: "Hourly to Salary Converter | Calculate Annual Equivalent Salary",
    metaDescription: "Convert your hourly wage to equivalent salary periods. Find weekly, monthly, and annual earnings from hourly rates instantly.",
    introText: "The Hourly to Salary Converter helps you translate hourly wages into regular salary figures. Whether you want to know how much an hourly pay rate equals per year, or need a breakdown of weekly, bi-weekly, semi-monthly, and monthly pay, this calculator provides instant equivalents based on your expected working schedule.",
    howToTitle: "How to Convert Hourly Wage to Salary",
    howToSteps: [
      "Enter your hourly pay rate (e.g., $25.00).",
      "Input the number of hours you expect to work per week (default is 40).",
      "Specify the number of working weeks in a year (standard is 52).",
      "View the calculated equivalents across all major pay frequencies (weekly, bi-weekly, semi-monthly, monthly, annual)."
    ],
    useCases: [
      {
        title: "Evaluating Job Offers",
        content: "When comparing an hourly contract role with a salaried permanent role, use this tool to bring both salaries to the same scale (annual or weekly) to make an informed financial decision."
      },
      {
        title: "Personal Budgeting",
        content: "Hourly workers can find their standard monthly income equivalent to set realistic rent, mortgage, or monthly savings goals."
      },
      {
        title: "HR and Business Budgeting",
        content: "Determine the annual salary allocation required when hiring a new hourly employee for a set number of weekly hours."
      }
    ],
    internalLinksText: "If you need to convert a salary into an hourly wage, use the Salary to Hourly Calculator. For projecting actual take-home earnings after taxes, try the Gross-to-Net Time Pay Sheet.",
    relatedToolSlugs: [
      "salary-to-hourly",
      "annual-work-hours",
      "gross-to-net-pay"
    ],
    faqs: [
      {
        question: "How is hourly wage converted to annual salary?",
        answer: "The annual salary is calculated by multiplying the hourly rate by the number of hours worked per week, then multiplying by the number of work weeks in a year (e.g., $25/hr × 40 hrs/week × 52 weeks = $52,000/year)."
      },
      {
        question: "What is the difference between bi-weekly and semi-monthly pay periods?",
        answer: "Bi-weekly pay occurs once every two weeks (26 times a year), while semi-monthly pay occurs twice a month, usually on the 15th and last day (24 times a year). As a result, the payment per period for semi-monthly pay is slightly higher than bi-weekly pay."
      },
      {
        question: "Does this account for unpaid holidays or vacations?",
        answer: "By default, it assumes 52 paid weeks in a year. If you have unpaid vacation or holidays, you can adjust the 'Weeks per Year' input downward (e.g., to 50 weeks) to reflect unpaid time off."
      }
    ]
  }
};
