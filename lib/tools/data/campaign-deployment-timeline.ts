import { ToolPageData } from "../toolPageData";

export const campaignDeploymentTimelineData: ToolPageData = {
  slug: "campaign-deployment-timeline",
  name: "Campaign Deployment Timeline Planner",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Map marketing phases (content, design, ads) backward from launch date and assign operational channels.",
  
  seo: {
    title: "Campaign Deployment Timeline Planner | Marketing Scheduler",
    metaDescription: "Plan multi-channel marketing campaigns. Work backward from your campaign launch date to schedule design, content, and ad placements.",
    introText: "The Campaign Deployment Timeline Planner is a marketing calendar tool. By setting a fixed launch date and adding pre-launch campaign phases (e.g. content creation, design assets, paid ad setup), the tool calculates start and end dates for each phase and organizes them by marketing channels and owners.",
    howToTitle: "How to Plan a Campaign Timeline",
    howToSteps: [
      "Select your campaign launch date.",
      "Add campaign phases, entering durations in days and buffer days.",
      "Assign each phase to a specific marketing channel (e.g., Email, Paid Ads, Social Media, Content).",
      "Assign owners to each phase to establish operational accountability.",
      "Review the calculated start and finish dates for each campaign phase on the timeline."
    ],
    useCases: [
      {
        title: "Product Launch Campaigns",
        content: "Marketing teams coordinate multi-channel campaigns (PR, social, email, ads) leading to product release. Back-planning ensures ad approvals and blog posts are ready for the launch."
      },
      {
        title: "Holiday Promotion Schedules",
        content: "E-commerce retailers plan promotions for Black Friday or Christmas. Setting timelines backward ensures email lists are segmented and graphics are approved ahead of shopping rushes."
      },
      {
        title: "Event Promotion Timelines",
        content: "Event marketers schedule ticket sales, early-bird promos, and speaker reveals. A structured campaign timeline aligns content releases with ticketing milestones."
      }
    ],
    internalLinksText: "To plan general milestones backward, try the Project Deadline Back-Planner. For project gantt scheduling, check the Gantt Chart Date Calculator. To size project buffers, use the Milestone Buffer & Risk Calculator.",
    relatedToolSlugs: [
      "project-back-planner",
      "gantt-chart-date-calculator",
      "milestone-buffer-calculator"
    ],
    faqs: [
      {
        question: "How does back-planning benefit marketing campaigns?",
        answer: "Back-planning ensures that early preparatory tasks (like copywriting or asset design) are started early enough. It prevents last-minute bottlenecks that could cause late ad launches or inconsistent messaging."
      },
      {
        question: "What are phase buffer days?",
        answer: "Buffer days are contingency margins added to a campaign phase. If copywriting runs 2 days late, the buffer absorbs the delay, keeping the downstream design and ad setup phases on schedule."
      },
      {
        question: "Can I filter or group the timeline by marketing channel?",
        answer: "Yes, the planner outputs a timeline categorized by channels (e.g. Paid Media, Social, Email) and owners, helping different teams focus on their specific deliverables."
      }
    ]
  }
};
