import { ToolPageData } from "../toolPageData";

export const multiJobIncomeSyncData: ToolPageData = {
  slug: "multi-job-income-sync",
  name: "Multi-Job Income Sync Clocks",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Track combined income, hourly rates, and schedules across multiple concurrent jobs or contracts.",
  
  seo: {
    title: "Multi-Job Income Sync | Calculate Cumulative Job Earnings",
    metaDescription: "Determine your total weekly, monthly, and annual income across multiple concurrent jobs. Track hours and average earnings per hour.",
    introText: "The Multi-Job Income Sync Clocks tool is designed for professionals managing multiple jobs, side hustles, or freelance contracts simultaneously. By entering pay rates and weekly hours for each job, you can instantly see your total combined earnings and track your cumulative workloads.",
    howToTitle: "How to Sync and Calculate Multi-Job Income",
    howToSteps: [
      "Add rows for each job or side contract you hold.",
      "Enter the job name, hourly pay rate, and expected work hours per week.",
      "Read your total weekly, monthly, and annual gross income across all jobs combined.",
      "Track your cumulative weekly hours to monitor work capacity limits."
    ],
    useCases: [
      {
        title: "Side Hustle Income Tracking",
        content: "If you work a primary full-time job and run two freelance contracts on weekends, use this tool to calculate your combined annual earnings and evaluate your total work hours."
      },
      {
        title: "Gig Economy Workers",
        content: "Sync pay rates and hours across multiple delivery or rideshare platforms to calculate your total monthly income equivalents."
      },
      {
        title: "Evaluating Career Transitions",
        content: "Model whether taking on two part-time freelance roles will yield more income than a single full-time salaried position, adjusting for hourly limits."
      }
    ],
    internalLinksText: "To convert a single job's hourly rate to a salary, use the Hourly to Salary Converter. For allocating hours across multiple portfolio clients, try the Fractional Work Hours Allocator.",
    relatedToolSlugs: [
      "hourly-to-salary",
      "billable-hours-tracker",
      "fractional-work-hours-allocator"
    ],
    faqs: [
      {
        question: "How is monthly income estimated for multiple jobs?",
        answer: "Monthly income is calculated by taking the total annual income (weekly income × 52 weeks) and dividing it by 12 months, which provides a standard average monthly projection."
      },
      {
        question: "How many jobs can I track simultaneously?",
        answer: "You can add up to 5 concurrent jobs or side contracts in the table, allowing you to model complex, multi-tiered income streams."
      },
      {
        question: "Does this tool calculate net pay or taxes?",
        answer: "This tool calculates gross earnings. Since holding multiple jobs can affect your overall tax bracket, you may want to consult our Gross-to-Net Pay Calculator to estimate tax withholdings."
      }
    ]
  }
};
