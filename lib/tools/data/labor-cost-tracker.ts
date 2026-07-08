import { ToolPageData } from "../toolPageData";

export const laborCostTrackerData: ToolPageData = {
  slug: "labor-cost-tracker",
  name: "Time-Weighted Employee Utility Tracker",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Track combined employee labor costs, overhead multipliers, and project margins based on hours worked.",
  
  seo: {
    title: "Time-Weighted Labor Cost Tracker | Calculate Employee Utility",
    metaDescription: "Monitor employee labor costs, apply overhead multipliers (taxes, benefits), and calculate total project labor cost. Free HR utility tool.",
    introText: "The Time-Weighted Employee Utility Tracker (Labor Cost Tracker) helps managers and small business owners calculate the true cost of employee labor. By entering pay rates, hours worked, and overhead multipliers (for benefits, taxes, and equipment) across your team, you can estimate total labor expenses and monitor project cost efficiency.",
    howToTitle: "How to Track Labor Costs",
    howToSteps: [
      "Add rows for each employee working on the project.",
      "Enter the employee name, hourly rate, and hours worked.",
      "Specify an overhead multiplier (e.g., 1.25 for a 25% overhead rate) to account for additional employment costs.",
      "Review the regular labor cost, total cost with overhead, effective rates, and cumulative team summaries."
    ],
    useCases: [
      {
        title: "Project Margin Management",
        content: "Track the actual labor costs accumulating on a client project to compare them against the contract budget and maintain healthy margins."
      },
      {
        title: "True Cost of Employment (Fully Burdened)",
        content: "Understand the 'burdened' rate of your team by adding payroll taxes, healthcare benefits, and software licenses as overhead multipliers."
      },
      {
        title: "Freelance Team Management",
        content: "If you hire subcontractors at different hourly rates, log their weekly hours here to calculate your total weekly labor payout."
      }
    ],
    internalLinksText: "To compile billable hours across projects, try the Billable Hours Tracker. For calculating overtime payroll splits, use the Overtime Pay Calculator.",
    relatedToolSlugs: [
      "billable-hours-tracker",
      "fractional-work-hours-allocator",
      "overtime-pay-calculator"
    ],
    faqs: [
      {
        question: "What is an overhead multiplier (labor burden)?",
        answer: "An overhead multiplier accounts for non-wage labor expenses such as employer payroll taxes, healthcare, insurance, benefits, and office equipment. A multiplier of 1.30 means that for every $1.00 in wages, there is an additional $0.30 in overhead costs."
      },
      {
        question: "How is the average cost per hour determined?",
        answer: "The average cost per hour is the total labor cost (including overhead) divided by the total hours worked across all employees in the table."
      },
      {
        question: "How many employees can I track at once?",
        answer: "You can track up to 10 employees concurrently in the calculator table, making it perfect for small teams or specific project groups."
      }
    ]
  }
};
