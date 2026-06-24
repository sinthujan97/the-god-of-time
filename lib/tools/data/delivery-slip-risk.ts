import { ToolPageData } from "../toolPageData";

export const deliverySlipRiskData: ToolPageData = {
  slug: "delivery-slip-risk",
  name: "Delivery Slip Risk Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#9B8EF5",
  description: "Evaluate project delivery risk and slip probability by tracking velocity against target completion dates.",
  
  seo: {
    title: "Delivery Slip Risk Calculator | Project Slippage Estimator",
    metaDescription: "Calculate project delivery slip risk and forecast real completion dates. Analyze team velocity ratio and risk indicators for milestones.",
    introText: "The Delivery Slip Risk Calculator is a projective tracking tool. By comparing elapsed time, planned duration, and current completion percentage, it determines the project's 'Velocity Ratio'. The engine forecasts the expected delivery date at the current rate of progress and assigns a risk score and risk level (on-track, at-risk, high-risk, critical) to warn managers of impending slippage.",
    howToTitle: "How to Calculate Delivery Slip Risk",
    howToSteps: [
      "Enter the project's original start date.",
      "Select the planned delivery date.",
      "Enter the current evaluation date (defaults to today).",
      "Input the current project completion percentage (0% to 100%).",
      "Analyze the predicted completion date, slip days, and the risk score."
    ],
    useCases: [
      {
        title: "Agile Development Burn-up Audits",
        content: "Scrum masters compare work completed against sprint timelines. If a team is 50% through the timeline but has only completed 30% of user stories, the calculator flags the delay early enough to adjust scope."
      },
      {
        title: "Client-Facing Milestone Reporting",
        content: "Project managers audit schedules before monthly progress calls. If the velocity ratio indicates a 15-day delivery slip, managers can negotiate deadline adjustments or increase resource allocations."
      },
      {
        title: "Product Launch Quality Checks",
        content: "Hardware or software release managers evaluate build stability and test case completion. Projecting actual launch readiness based on current completion rates prevents premature releases."
      }
    ],
    internalLinksText: "To size buffers for critical tasks, try the Milestone Buffer & Risk Calculator. For planning milestones backwards, use the Project Deadline Back-Planner. To analyze critical path floats, see the Critical Path Method Float Calculator.",
    relatedToolSlugs: [
      "milestone-buffer-calculator",
      "project-back-planner",
      "cpm-critical-path-float"
    ],
    faqs: [
      {
        question: "What is a project velocity ratio?",
        answer: "The velocity ratio is the ratio of progress completed to time elapsed. A ratio of 1.0 indicates perfect alignment; a ratio of 0.8 means progress is running 20% slower than elapsed time, signaling a high risk of missing the deadline."
      },
      {
        question: "How does the calculator determine slip days?",
        answer: "Slip days are the difference between the projected completion date (based on active velocity) and the original planned delivery date. If a project is running slow, the projected completion date shifts later, yielding slip days."
      },
      {
        question: "What actions should be taken for a 'high-risk' status?",
        answer: "For high-risk and critical statuses, managers should either adjust the final deadline, reduce scope (cut features or deliverables), or reallocate resources (add team members) to increase daily completion velocity."
      }
    ]
  }
};
