import { ToolPageData } from "../toolPageData";

export const billableHoursTrackerData: ToolPageData = {
  slug: "billable-hours-tracker",
  name: "Billable Hours Tracker",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#60A5D4",
  description: "Log working hours across multiple clients and projects, and generate clear, invoice-ready financial summaries.",
  
  seo: {
    title: "Billable Hours Tracker | Invoice-Ready Hour Log",
    metaDescription: "Log and calculate billable working hours across multiple clients. Generate invoice-ready summaries with hourly rates instantly.",
    introText: "The Billable Hours Tracker helps freelancers, consultants, and contractors log work sessions, assign hourly rates, and track total value across multiple clients. Rather than using messy spreadsheets, enter your daily or weekly sessions here to create a clean breakdown of billable hours and invoice totals.",
    howToTitle: "How to Track Your Billable Hours",
    howToSteps: [
      "Add rows for your work sessions, entering the client name, date, and description.",
      "Enter the start and end times for each session.",
      "Input the hourly billing rate agreed upon with the client.",
      "Read your total hours logged, total invoice value, and a client-by-client billing summary in real-time."
    ],
    useCases: [
      {
        title: "Freelancers with Multiple Clients",
        content: "Track concurrent projects for different clients throughout the week, ensuring you invoice for every hour spent on design, development, or consulting."
      },
      {
        title: "Lawyers and Legal Consultants",
        content: "Keep a structured log of hours dedicated to client cases or meetings to back up billing summaries and maintain audit compliance."
      },
      {
        title: "Subcontractor Reporting",
        content: "Provide clean, time-stamped work reports to primary contractors to justify your weekly hours and simplify payments."
      }
    ],
    internalLinksText: "If you need to plan your freelance capacity limits, check out the Freelance Project Capacity Planner. For tracking client retainer burn rates, try the Retainer Time Burner.",
    relatedToolSlugs: [
      "freelance-capacity-planner",
      "time-card-calculator",
      "retainer-burndown"
    ],
    faqs: [
      {
        question: "Does the tracker support different rates for different clients?",
        answer: "Yes. You can assign a custom hourly rate to each work session row, allowing you to track multi-tiered billing rates on a single worksheet."
      },
      {
        question: "Can I enter overnight sessions?",
        answer: "Yes. The start and end time calculation supports overnight transitions. If the end time is chronologically earlier than the start time, it calculates across the midnight boundary correctly."
      },
      {
        question: "How is the average rate per hour determined?",
        answer: "The average rate per hour is calculated by dividing the total invoice value by the total number of hours worked across all clients."
      }
    ]
  }
};
