import { ToolPageData } from "../toolPageData";

export const slaCountdownTimerData: ToolPageData = {
  slug: "sla-countdown-timer",
  name: "SLA Breach Countdown Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Calculate deadline and countdown until Service Level Agreement (SLA) breach, supporting business hours.",
  
  seo: {
    title: "SLA Breach Countdown Calculator | Response Time Planner",
    metaDescription: "Calculate exact SLA breach deadlines and remaining time. Supports custom business hours, weekends, and holidays for incident response tracking.",
    introText: "The SLA Breach Countdown Calculator is a high-precision tool for IT, support, and operation managers to compute response and resolution deadlines. By taking a ticket creation timestamp, a specified SLA target window (in hours or minutes), and the team's operational hours, the calculator determines the exact deadline. It excludes non-business hours, weekends, and federal holidays to ensure compliance with service contracts.",
    howToTitle: "How to Calculate SLA Deadlines",
    howToSteps: [
      "Enter the ticket creation or response start date and time.",
      "Specify the SLA target limit in hours or minutes (e.g., 4-hour response, 24-hour resolution).",
      "Set operational business hours (e.g., 24/7 coverage, or 9:00 AM - 5:00 PM).",
      "Choose whether to exclude weekends and federal holidays from the SLA window.",
      "View the calculated breach date, time, and active countdown timer."
    ],
    useCases: [
      {
        title: "IT Support Help Desk Tickets",
        content: "Tier 1 and Tier 2 IT support tickets must be resolved within strict SLAs (e.g., critical bugs in 2 hours, minor bugs in 48 hours). The calculator projects breach limits according to helpdesk schedules."
      },
      {
        title: "Client Service Level Agreements",
        content: "SaaS providers guarantee a certain uptime and issue resolution time. Support managers monitor breach timers to prioritize engineering queues and maintain client trust."
      },
      {
        title: "Supply Chain & Order Fulfillment",
        content: "Logistics companies operate under delivery guarantees (e.g., process order within 24 working hours). The countdown tracker helps managers deploy resources to meet warehouse SLAs."
      }
    ],
    internalLinksText: "To plan overall deadlines, try the Project Deadline Back-Planner. For standard working hour analysis, check the Working Hours Tracker. To measure general lead times, see the Lead Time & Cycle Time Calculator.",
    relatedToolSlugs: [
      "project-back-planner",
      "working-hours-tracker",
      "lead-time-calculator"
    ],
    faqs: [
      {
        question: "What is SLA response vs. resolution time?",
        answer: "SLA response time is the duration between ticket creation and the first reply from support. SLA resolution time is the duration from ticket creation to issue resolution. Both are tracked as independent metrics with separate timers."
      },
      {
        question: "How does the business hours setting affect the breach timer?",
        answer: "If your support window is 9 AM to 5 PM, a ticket arriving at 4 PM with a 2-hour SLA is not breached at 6 PM. The countdown pauses at 5 PM and resumes at 9 AM the next business day, setting the deadline at 10 AM."
      },
      {
        question: "Does the calculator support custom federal holidays?",
        answer: "Yes, standard US federal holidays (like New Year's Day, Memorial Day, Independence Day, Thanksgiving, and Christmas) are integrated and can be toggled off to ensure SLAs reflect active support availability."
      }
    ]
  }
};
