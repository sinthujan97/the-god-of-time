import { ToolPageData } from "../toolPageData";

export const cpmCriticalPathFloatData: ToolPageData = {
  slug: "cpm-critical-path-float",
  name: "Critical Path Method Float Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Calculate early/late start and finish dates, identify the critical path, and compute task float (slack).",
  
  seo: {
    title: "Critical Path Method Float Calculator | CPM Schedule Planner",
    metaDescription: "Calculate project critical path and task float values. Compute early/late start and finish dates using forward and backward pass algorithms.",
    introText: "The Critical Path Method Float Calculator is an advanced project scheduling tool. It performs forward and backward pass calculations over a network of dependent tasks to determine early/late start and finish times. It computes total float (slack) and free float for every task, identifying the critical path of tasks that must finish on time to prevent project delay.",
    howToTitle: "How to Calculate Critical Path and Float",
    howToSteps: [
      "Add your project tasks with their durations in days.",
      "List predecessors for each task to establish the network dependencies.",
      "Click calculate to perform forward and backward pass scheduling.",
      "Review the task list to find the critical path (highlighted tasks with zero float).",
      "Inspect the float breakdown to see which tasks can be delayed without affecting the project completion date."
    ],
    useCases: [
      {
        title: "Construction Project Scheduling",
        content: "Large-scale construction relies on CPM to coordinate plumbing, electrical, and structural engineering. Knowing which tasks have float allows managers to shift labor resources without delaying final delivery."
      },
      {
        title: "Large Software Implementations",
        content: "Enterprise systems deployments link database migrations, API creation, UI polishing, and security audits. CPM calculations identify the bottlenecks that require developer focus."
      },
      {
        title: "Event Planning and Logistics",
        content: "Production companies managing product launches map dependent tasks. Tracking tasks with zero float ensures stage setup and media tests finish before doors open."
      }
    ],
    internalLinksText: "To plan dates across Gantt charts, try the Gantt Chart Date Calculator. For backward schedule planning, check the Project Deadline Back-Planner. To evaluate deadline slippage risks, use the Delivery Slip Risk Calculator.",
    relatedToolSlugs: [
      "gantt-chart-date-calculator",
      "project-back-planner",
      "delivery-slip-risk"
    ],
    faqs: [
      {
        question: "What is the critical path in a project schedule?",
        answer: "The critical path is the longest sequence of dependent tasks that determines the minimum total duration of the project. Any delay to a task on the critical path directly delays the project completion date."
      },
      {
        question: "What is the difference between Total Float and Free Float?",
        answer: "Total Float is the amount of time a task can be delayed from its early start without delaying the final project completion date. Free Float is the amount of time a task can be delayed without delaying the early start date of any immediate successor task."
      },
      {
        question: "How does a forward pass differ from a backward pass?",
        answer: "A forward pass calculates the earliest possible start and finish dates for each task, moving chronologically from start to end. A backward pass calculates the latest possible start and finish dates that still meet the final project deadline, moving in reverse from end to start."
      }
    ]
  }
};
