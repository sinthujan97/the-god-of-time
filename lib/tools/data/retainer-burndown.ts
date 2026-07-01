import { ToolPageData } from "../toolPageData";

export const retainerBurndownData: ToolPageData = {
  slug: "retainer-burndown",
  name: "Retainer Time Burner",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Track hours consumed vs. remaining balance for monthly retainer clients, projecting burn rates and depletion dates.",
  
  seo: {
    title: "Retainer Time Burner | Track Retainer Burndown Rates",
    metaDescription: "Monitor retainer hours consumed. Calculate remaining hours, retainer value, current burn rate, and projected depletion dates.",
    introText: "The Retainer Time Burner helps freelancers, agencies, and consultants track monthly hours allocated to retainer clients. Enter your total retainer hours, hourly rate, hours used, and period dates to instantly generate burn rates, projected depletion dates, and visual capacity progress bars.",
    howToTitle: "How to Track Retainer Burndown",
    howToSteps: [
      "Enter the total monthly retainer hours agreed upon with your client.",
      "Input your hourly billing rate to track financial values.",
      "Enter the number of hours you have logged/consumed so far during the current period.",
      "Provide the start and end dates of the monthly billing period.",
      "Review the breakdown of remaining hours, burn rate, and the estimated depletion date."
    ],
    useCases: [
      {
        title: "Client Retainer Management",
        content: "Provide monthly updates to clients on how much retainer time remains, preventing over-delivery or sudden billing adjustments at the end of the month."
      },
      {
        title: "Pacing Workloads",
        content: "Consultants can check if they are burning through retainer hours too quickly during the first half of the month, adjusting their availability to stretch hours across the period."
      },
      {
        title: "Revenue Recognition",
        content: "Track the financial value of used vs. remaining retainer hours to evaluate active earnings and invoice allocations."
      }
    ],
    internalLinksText: "To track billable hours logs, check out the Billable Hours Tracker. If you need to plan portfolio clients as a fractional leader, try the Fractional Executive Hours Allocator.",
    relatedToolSlugs: [
      "billable-hours-tracker",
      "freelance-capacity-planner",
      "fractional-executive"
    ],
    faqs: [
      {
        question: "What is a retainer burn rate?",
        answer: "The burn rate is the average number of hours consumed per day since the period began. It helps project whether your current pace will exceed or fall short of the total retainer hours by the end of the month."
      },
      {
        question: "How is the depletion date projected?",
        answer: "The depletion date is estimated by dividing the remaining hours by your current daily burn rate, and adding that number of days to today's date."
      },
      {
        question: "What does 'hours per day needed' mean?",
        answer: "This is the number of hours you must work each day during the remaining days of the period to exactly exhaust the retainer hours without exceeding them."
      }
    ]
  }
};
