import { ToolPageData } from "../toolPageData";

export const criticalPathCalculatorData: ToolPageData = {
  slug: "critical-path-calculator",
  name: "Critical Path Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Find the critical path, float, and project duration for any network of tasks. Works for AON and AOA methods.",

  seo: {
    title: "Critical Path Calculator | Free CPM Tool Online",
    metaDescription: "Free critical path calculator. Find the critical path, float, and project duration for any network of tasks. Works for AON and AOA methods. No signup.",
    introText:
      "This critical path calculator identifies the longest sequence of dependent tasks in a project — the path that determines the minimum possible project duration no matter how much you optimize everything else. As a critical path method calculator, it runs the same forward and backward pass algorithm project scheduling professionals have relied on for decades, so you get an authoritative CPM analysis without doing the arithmetic by hand. If you've ever needed to know how to calculate critical path for a real schedule with dozens of interdependent tasks, this tool does it in seconds — a workflow built for project managers, PMPs, construction managers, and engineers.",
    howToTitle: "How to Calculate the Critical Path",
    howToSteps: [
      "Enter all tasks with their durations and dependencies on other tasks.",
      "Let the calculator perform the forward pass (calculating Early Start and Early Finish) and backward pass (calculating Late Start and Late Finish) automatically.",
      "Review the critical path — highlighted as the sequence of tasks with zero float — along with the float value for every other task."
    ],
    useCases: [
      {
        title: "Critical Path Method Explained Step by Step",
        content:
          "The Critical Path Method follows a consistent seven-step process regardless of project size. Step 1 is listing every project task along with its duration estimate. Step 2 is identifying the dependencies between tasks — which tasks must finish before others can start. Step 3 builds the network diagram connecting all tasks according to those dependencies. Step 4, the forward pass, calculates each task's Early Start (ES) and Early Finish (EF) by working chronologically from the project's beginning toward its end. Step 5, the backward pass, calculates each task's Late Start (LS) and Late Finish (LF) by working in reverse from the project's required end date back toward the start. Step 6 computes float for every task as Float = LS − ES (or equivalently LF − EF) — the amount of slack a task has before it starts delaying the project. Step 7 identifies the critical path as every task where float equals zero, since any delay to a zero-float task delays the entire project by the same amount. Working through a simple 4-5 task example — say, Design (3 days) → Build (5 days, depends on Design) → Test (2 days, depends on Build) and QA Sign-off (1 day, depends on Test), with Documentation (4 days) running in parallel starting alongside Design — makes it clear how the forward pass locks in the earliest possible finish date while the backward pass reveals which parallel tasks (like Documentation) have float and which sequential chain (Design→Build→Test→Sign-off) is actually critical."
      }
    ],
    faqs: [
      {
        question: "What is a critical path calculator?",
        answer:
          "A critical path calculator applies the Critical Path Method (CPM) algorithm to a network of project tasks and dependencies. It performs forward and backward passes to determine the earliest and latest start and finish times for each task, calculates float (slack), and identifies the critical path — the sequence of tasks that determines the minimum project duration."
      },
      {
        question: "How does the critical path method work?",
        answer:
          "CPM works in two passes. The forward pass calculates the earliest start and finish times for every task moving from project start to end. The backward pass then calculates the latest start and finish times moving from end to start. Tasks where Early Start equals Late Start have zero float and are on the critical path. Any delay to a critical path task delays the entire project."
      },
      {
        question: "Can I use this calculator for large projects?",
        answer:
          "Yes. Enter as many tasks and dependencies as your project requires. For very large projects with hundreds of tasks, consider breaking the project into phases and calculating the critical path within each phase, then linking the phases. The calculator handles all standard dependency types: finish-to-start, start-to-start, finish-to-finish, and start-to-finish."
      },
      {
        question: "What are the benefits of using a critical path calculator?",
        answer:
          "CPM analysis reveals which tasks must stay on schedule to avoid delaying the project and which tasks have flexibility (float). This allows project managers to prioritize resource allocation to critical tasks, negotiate deadline changes with stakeholders based on data, and identify opportunities to compress the schedule by fast-tracking or crashing critical path tasks."
      },
      {
        question: "How do I interpret float in the results?",
        answer:
          "Float (or slack) is the amount of time a task can be delayed without delaying the project end date. Zero float means the task is on the critical path — any delay directly extends the project. Positive float means the task has flexibility. Negative float means the project is already scheduled to finish late and requires schedule compression or scope reduction."
      },
      {
        question: "What is the difference between AON and AOA methods?",
        answer:
          "Activity on Node (AON) places each activity in a node (box) with arrows showing dependencies — this is the most commonly used method today. Activity on Arrow (AOA) places activities on the arrows with nodes representing events — this older method requires dummy activities for certain dependency relationships. Both produce the same critical path result. This calculator uses the AON method."
      }
    ],
    internalLinksText:
      "To add schedule buffer to protect your critical path, use the Project Buffer Calculator. To work backwards from a deadline through project phases, try the Project Deadline Back-Planner. To plan sprint dates for agile project delivery, see the Agile Sprint Date Calculator.",
    relatedToolSlugs: [
      "project-buffer-calculator",
      "project-back-planner",
      "agile-sprint-date-calculator"
    ]
  }
};
