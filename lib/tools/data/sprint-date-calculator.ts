import { ToolPageData } from "../toolPageData";

export const sprintDateCalculatorData: ToolPageData = {
  slug: "sprint-date-calculator",
  name: "Agile Sprint Date Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#9B8EF5",
  description: "Generate a multi-sprint Agile calendar with custom lengths, planning sessions, and demo days.",
  
  seo: {
    title: "Agile Sprint Date Calculator | Scrum Calendar Planner",
    metaDescription: "Generate your Agile Scrum sprint calendar automatically. Calculate start/end dates, planning, grooming, review, and demo dates for multiple sprints.",
    introText: "The Agile Sprint Date Calculator generates custom multi-sprint calendars for Scrum development teams. Input your release start date, sprint length, and number of sprint cycles, and the engine automatically maps out the start and end dates of every sprint. It also projects specific Scrum events like planning sessions, backlog refinement, reviews, and retrospectives.",
    howToTitle: "How to Calculate Agile Sprint Dates",
    howToSteps: [
      "Select the starting date of your first sprint.",
      "Enter the length of each sprint (typically 2 weeks / 10 working days).",
      "Specify the number of sprints you want to map out in the release cycle.",
      "Choose which day of the week sprints start (e.g., Monday or Wednesday).",
      "Select dates for recurring scrum meetings (planning, review, retrospective) to see them mapped on the schedule."
    ],
    useCases: [
      {
        title: "Product Release Roadmap Planning",
        content: "Product managers coordinate quarterly roadmaps by dividing the timeline into 2-week sprints. The sprint calendar allows them to map features to specific sprint end dates and demo windows."
      },
      {
        title: "Cross-Functional Scrum Syncing",
        content: "For organizations with multiple scrum teams, aligning sprint start and end dates (and demo schedules) is essential for co-dependent releases and shared deployment resources."
      },
      {
        title: "Client Delivery Alignment",
        content: "Agency project managers share sprint calendar timelines with external clients to establish clear delivery check-ins, demo expectations, and feedback loops."
      }
    ],
    internalLinksText: "To plan task dependencies within a sprint, use the Gantt Chart Date Calculator. For long-term timeline mapping, check the Project Deadline Back-Planner. To track working days within a sprint, try the Business Days Calculator.",
    relatedToolSlugs: [
      "gantt-chart-date-calculator",
      "project-back-planner",
      "business-days-calculator"
    ],
    faqs: [
      {
        question: "What is the standard sprint length in Agile Scrum?",
        answer: "The most common sprint length is 2 weeks (10 business days). However, teams also run 1-week or 4-week sprints depending on feedback frequency and project volatility. This calculator supports custom sprint durations."
      },
      {
        question: "How are holidays handled in sprint planning?",
        answer: "Standard sprints operate on business days. If a holiday falls during a sprint, it reduces the team's capacity (velocity) but generally does not shift the sprint end date. The calculator keeps sprint boundaries consistent."
      },
      {
        question: "Can sprints start on any day of the week?",
        answer: "Yes. Sprints frequently start on Mondays and end on Fridays, but starting on Wednesday or Thursday can avoid weekend disruptions and prevent critical deployments on Friday afternoons."
      }
    ]
  }
};
