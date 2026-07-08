import { ToolPageData } from "../toolPageData";

export const leadTimeCalculatorData: ToolPageData = {
  slug: "lead-time-calculator",
  name: "Lead Time & Cycle Time Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Track and calculate manufacturing, software development, or service delivery lead times and process efficiency.",
  
  seo: {
    title: "Lead Time & Cycle Time Calculator | Process Efficiency",
    metaDescription: "Measure lead time, cycle time, and process queue times. Calculate process efficiency index for Kanban and manufacturing workflows.",
    introText: "The Lead Time & Cycle Time Calculator is an analytics tool designed for operations managers, software scrum masters, and manufacturing leads. It measures process speeds by breaking down timestamps from customer request to final delivery. This helps isolate active work time (Cycle Time) from queue or waiting times, yielding a Process Cycle Efficiency percentage.",
    howToTitle: "How to Calculate Lead and Cycle Time",
    howToSteps: [
      "Enter the timestamp when the customer made the request (Start of Lead Time).",
      "Enter the timestamp when work actively began on the task (Start of Cycle Time).",
      "Enter the timestamp when the task was completed and delivered.",
      "Specify any idle or waiting time during the active phase to calculate queue times.",
      "Review the total lead time, cycle time, queue time, and overall process efficiency."
    ],
    useCases: [
      {
        title: "Software Kanban Workflow Optimization",
        content: "Scrum masters track 'to-do' to 'done' (Lead Time) and 'in progress' to 'done' (Cycle Time). Identifying long queues before development starts helps resolve planning bottlenecks."
      },
      {
        title: "Order Fulfillment & Logistics",
        content: "E-commerce stores measure lead time from cart check-out to package arrival at the customer's door. Minimizing dispatch delays (queue time) improves customer satisfaction."
      },
      {
        title: "Lean Manufacturing Production",
        content: "Plant managers use cycle times to balance assembly lines. Reducing inventory wait states (non-value-added time) directly improves the company's operating margin."
      }
    ],
    internalLinksText: "To monitor team availability across global zones, try the Remote Team Time Zone Overlap Finder. For milestone planning, check the Project Deadline Back-Planner. To analyze SLA response times, use the SLA Timer.",
    relatedToolSlugs: [
      "remote-team-overlap",
      "project-back-planner",
      "sla-timer"
    ],
    faqs: [
      {
        question: "What is the difference between Lead Time and Cycle Time?",
        answer: "Lead Time measures the total time elapsed from the initial customer request to delivery (including queue and planning time). Cycle Time measures only the time spent actively working on the task once it enters the 'in progress' state."
      },
      {
        question: "How is Process Cycle Efficiency calculated?",
        answer: "Process Cycle Efficiency is calculated as (Value-Added Time / Total Lead Time) x 100. Value-added time is the time spent actively producing or coding, while lead time includes all queue delays, sign-off blocks, and shipping durations."
      },
      {
        question: "Why is tracking queue time important in Lean management?",
        answer: "In Lean systems, wait time is considered waste. Even if workers operate at peak speed (low cycle time), long queue times (waiting for approval or components) will keep overall lead times high. Cycle efficiency highlights these hidden bottlenecks."
      }
    ]
  }
};
