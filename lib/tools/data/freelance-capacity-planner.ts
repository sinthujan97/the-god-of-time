import { ToolPageData } from "../toolPageData";

export const freelanceCapacityPlannerData: ToolPageData = {
  slug: "freelance-capacity-planner",
  name: "Freelance Project Capacity Planner",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Plan your freelance business: calculate how many billable hours you need to hit your target monthly revenue.",
  
  seo: {
    title: "Freelance Project Capacity Planner | Calculate Billable Hours Needed",
    metaDescription: "Determine if your freelance income targets are realistic. Calculate required billable hours, total work hours (including admin time), and capacity limits.",
    introText: "The Freelance Project Capacity Planner is a planning tool designed for solo business owners, agency owners, and independent contractors. By entering your target monthly revenue, hourly rate, and admin overhead percentages, you can instantly see if your workload is achievable, calculate your capacity utilization rate, and plan your schedules without burning out.",
    howToTitle: "How to Plan Your Freelance Project Capacity",
    howToSteps: [
      "Enter your target monthly revenue goal (e.g., $5,000).",
      "Enter your hourly billable rate (e.g., $75.00).",
      "Specify your max working hours per day and working days per week to set your baseline available capacity.",
      "Adjust the admin/overhead time percentage (the time spent on marketing, invoicing, emails, and other non-billable tasks).",
      "Review the results: see if your target is achievable and find your required billable and total hours."
    ],
    useCases: [
      {
        title: "For Starting Freelancers",
        content: "Determine if your planned hourly rate can sustain your cost of living, helping you set realistic pricing before launching your service."
      },
      {
        title: "For Experienced Contractors",
        content: "Analyze your utilization rate to decide if you need to raise your rates, delegate admin tasks, or scale back on client commitments."
      },
      {
        title: "For Agency Owners",
        content: "Estimate client capacities for employee resources to maintain healthy margins and assign manageable workloads to staff."
      }
    ],
    internalLinksText: "To log your active hours for clients, try the Billable Hours Tracker. If you need to monitor retainer balances and burn rates, check out the Retainer Time Burner.",
    relatedToolSlugs: [
      "billable-hours-tracker",
      "hourly-to-salary",
      "retainer-burndown"
    ],
    faqs: [
      {
        question: "What is non-billable admin time?",
        answer: "Non-billable admin time includes all hours spent running your business that cannot be directly billed to clients (e.g., pitching, invoicing, client onboarding, bookkeeping, marketing, and professional development)."
      },
      {
        question: "How does the capacity utilization rate work?",
        answer: "The capacity utilization rate measures the proportion of your maximum available working hours that must be billable to meet your income target. A rate above 80% is generally high and risks burnout, while a rate above 100% means your goals are not mathematically achievable under your current constraints."
      },
      {
        question: "How is available monthly capacity calculated?",
        answer: "Available monthly capacity is calculated by multiplying your hours per day by work days per week, then multiplying by 4.33 (the average number of weeks in a month) to account for full calendar lengths."
      }
    ]
  }
};
