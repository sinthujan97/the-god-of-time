import { ToolPageData } from "../toolPageData";

export const fractionalExecutiveData: ToolPageData = {
  slug: "fractional-executive",
  name: "Fractional Executive Hours Allocator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Allocate weekly hours, track revenues, and monitor capacity utilization across multiple client portfolios.",
  
  seo: {
    title: "Fractional Executive Hours Allocator | Plan Portfolio Capacities",
    metaDescription: "Plan fractional executive hours and revenues. Track capacity utilization, remaining hours, and monthly revenues across multiple portfolio clients.",
    introText: "The Fractional Executive Hours Allocator helps fractional leaders, consultants, and advisors manage their portfolios. By inputting client hours and rates, you can balance your weekly calendar, monitor total monthly revenues, and visualize your capacity utilization.",
    howToTitle: "How to Allocate Fractional Executive Hours",
    howToSteps: [
      "Set your maximum weekly working hours (default is 40 hours).",
      "Add rows for your portfolio clients, specifying client names, hours allocated per week, and your hourly rate.",
      "Review the weekly and monthly revenue generated per client.",
      "Track your total weekly hours, capacity utilization percentage, and remaining available hours."
    ],
    useCases: [
      {
        title: "Fractional Leaders (CFOs, CMOs, CTOs)",
        content: "Balance commitments across 3-5 clients. Ensure you don't over-commit hours while optimizing your monthly billings."
      },
      {
        title: "Retainer-Based Advisors",
        content: "Allocate advisory hours to various board or consultant engagements, tracking total yield per week."
      },
      {
        title: "Transitioning to Fractional Work",
        content: "Model how many clients at what hourly rates and hours are required to match or exceed your former executive salary."
      }
    ],
    internalLinksText: "To track client retainer balances and burn rates, check out the Retainer Time Burner. For general freelance capacity planning, try the Freelance Project Capacity Planner.",
    relatedToolSlugs: [
      "freelance-capacity-planner",
      "retainer-burndown",
      "billable-hours-tracker"
    ],
    faqs: [
      {
        question: "What is capacity utilization?",
        answer: "Capacity utilization represents the percentage of your maximum weekly hours that are allocated to client work. For example, if you allocate 30 hours out of a 40-hour limit, your utilization rate is 75%."
      },
      {
        question: "How is monthly revenue projected?",
        answer: "Monthly revenue is calculated by multiplying the weekly client revenue by 4.33 (the average weeks in a month) to account for full calendar periods."
      },
      {
        question: "What happens if I exceed my maximum capacity?",
        answer: "If your allocated hours exceed your maximum capacity, the utilization rate rises above 100% and remaining hours become 0. The calculator displays a warning to help you adjust commitments."
      }
    ]
  }
};
