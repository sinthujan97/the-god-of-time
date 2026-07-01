import { ToolPageData } from "../toolPageData";

export const projectBackPlannerData: ToolPageData = {
  slug: "project-back-planner",
  name: "Project Deadline Back-Planner",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Work backward from a deadline to calculate start dates and milestones, incorporating buffer and weekend rules.",
  
  seo: {
    title: "Project Deadline Back-Planner | Milestone Calculator",
    metaDescription: "Calculate project start dates and milestone targets by working backward from your deadline. Incorporate durations, buffers, and weekend rules.",
    introText: "The Project Deadline Back-Planner is a professional scheduling tool designed to calculate the latest possible start dates for project phases and milestones to meet a hard final deadline. By inputting your target completion date and working backward through sequential dependencies, it automatically builds an optimized timeline. You can customize milestone durations, add contingency buffers, and choose whether to skip weekends to ensure realistic planning.",
    howToTitle: "How to Back-Plan a Project",
    howToSteps: [
      "Select your target project deadline or launch date using the calendar picker.",
      "List your project milestones in reverse order (e.g., final review, testing, development, design) with their duration in days.",
      "Add safety buffer days to critical milestones if desired to protect against unexpected delays.",
      "Toggle whether to exclude weekends from the calculation to ensure milestones fall on active business days.",
      "Review the generated project timeline to find the exact start date needed for every phase."
    ],
    useCases: [
      {
        title: "Product Launch Coordination",
        content: "When launching a new product on a fixed release date, marketing, development, and logistics teams must work backward to coordinate print deadlines, website updates, and inventory shipments without risking the launch day."
      },
      {
        title: "Event Planning and Production",
        content: "Conference and exhibition coordinators use back-planning to determine when venue bookings, speaker agreements, signage printing, and catering contracts must be finalized to avoid last-minute rush fees."
      },
      {
        title: "Corporate Financial Reporting",
        content: "Finance teams use back-planners to structure quarterly or annual closing schedules. Knowing when reports must be submitted to regulators dictates exactly when audits must start and ledger reconciliations must begin."
      }
    ],
    internalLinksText: "To visualize project timelines horizontally, try the Gantt Chart Date Calculator. For sprint scheduling, use the Agile Sprint Date Calculator. For calculating work durations, check the Lead Time & Cycle Time Calculator.",
    relatedToolSlugs: [
      "gantt-chart-date-calculator",
      "sprint-date-calculator",
      "lead-time-calculator"
    ],
    faqs: [
      {
        question: "What is back-planning in project management?",
        answer: "Back-planning, or backward scheduling, is a planning technique where you start with the final delivery deadline and work backward to determine when preceding tasks and milestones must start. This identifies the latest possible start date for the project."
      },
      {
        question: "How does the weekend exclusion toggle affect the dates?",
        answer: "If you toggle 'Exclude Weekends', the calculator counts only Monday through Friday as working days. Any milestone duration or buffer days will only consume business days, ensuring no start or end dates fall on a Saturday or Sunday."
      },
      {
        question: "Why should I add buffer days to milestones?",
        answer: "Buffer days serve as contingency time. If a task is delayed, the buffer absorbs the delay without shifting the final launch date. In back-planning, adding a buffer pushes the required start date of preceding tasks earlier."
      }
    ]
  }
};
