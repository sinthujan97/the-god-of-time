import { ToolPageData } from "../toolPageData";

export const ganttChartDateCalculatorData: ToolPageData = {
  slug: "gantt-chart-date-calculator",
  name: "Gantt Chart Date Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Map out project tasks with durations and dependencies to calculate start/end dates and visualize overlap.",
  
  seo: {
    title: "Gantt Chart Date Calculator | Task Schedule Finder",
    metaDescription: "Calculate start and end dates for dependent project tasks. Plan your Gantt chart schedule automatically with support for business day rules.",
    introText: "The Gantt Chart Date Calculator helps you map out a structured project schedule by linking tasks, durations, and dependency constraints. It dynamically schedules tasks based on their precursors, calculating the exact start and finish dates for every element of your project. The tool outputs a clean, sequential calendar timeline ready for Gantt chart plotting.",
    howToTitle: "How to Calculate Gantt Dates",
    howToSteps: [
      "Select a baseline start date for the overall project.",
      "Add tasks, defining their durations in days.",
      "Assign dependencies (predecessors) to tasks that cannot start until another task is finished.",
      "Enable weekend exclusion to ensure tasks are only scheduled on working days.",
      "Review the calculated start and finish dates, showing sequence and chronological order."
    ],
    useCases: [
      {
        title: "Construction Phase Planning",
        content: "Construction projects require strict sequence; foundation pouring must finish before framing starts. This tool maps out dependencies so delays in early phases automatically roll over to adjust subsequent start dates."
      },
      {
        title: "Software Development Roadmaps",
        content: "Product managers coordinate design, development, QA, and deployment. By setting dependencies, teams can see how shifting a design phase shifts the code freeze and launch dates."
      },
      {
        title: "Marketing Campaign Rollouts",
        content: "PR, content writing, graphic design, and social media scheduling represent interconnected steps. Gantt date calculations help coordinate resource availability across dependent marketing tasks."
      }
    ],
    internalLinksText: "To plan backwards from a fixed deadline, use the Project Deadline Back-Planner. For sprint cycle planning, try the Agile Sprint Date Calculator. To determine task floats, check the Critical Path Calculator.",
    relatedToolSlugs: [
      "project-back-planner",
      "agile-sprint-date-calculator",
      "critical-path-calculator"
    ],
    faqs: [
      {
        question: "What is a predecessor in a Gantt chart?",
        answer: "A predecessor is a task that must be completed before another task can begin. For example, Task A is a predecessor to Task B. In this tool, Task B's start date is automatically scheduled to begin the day after Task A ends."
      },
      {
        question: "How does the tool handle circular dependency loops?",
        answer: "The tool uses topological sorting algorithms (Kahn's algorithm) to validate task relationships. If a circular loop is detected (e.g., Task A depends on Task B, which depends on Task A), the tool displays a warning, prompting you to resolve the conflict."
      },
      {
        question: "Does the calculator support manual overrides for task start dates?",
        answer: "By default, this scheduling engine calculates dates automatically based on project start and dependencies. However, tasks without predecessors will start on the base project date, allowing you to control the schedule structure."
      }
    ]
  }
};
