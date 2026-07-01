import { ToolPageData } from "../toolPageData";

export const downtimeUptimeCalculatorData: ToolPageData = {
  slug: "downtime-uptime-calculator",
  name: "Downtime & Service Uptime Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Calculate overall service uptime percentage and review total downtime durations from incident logs.",
  
  seo: {
    title: "Downtime & Service Uptime Calculator | SLA Uptime Planner",
    metaDescription: "Calculate service uptime percentages and maximum allowed downtime. Track system availability against SLA targets (99.9%, 99.99%, etc.) with incident logging.",
    introText: "The Downtime & Service Uptime Calculator translates service availability percentages into operational time limits and monitors system performance. By logging incident start and end times, SREs and DevOps teams can determine precise uptime percentages over standard periods, ensuring compliance with client SLA agreements.",
    howToTitle: "How to Calculate Uptime and Downtime",
    howToSteps: [
      "Select the duration of the monitoring window (e.g., month, quarter, year, or a custom date range).",
      "Enter your target SLA uptime percentage (such as 99.9% or 99.99%).",
      "Input a list of system outages or incidents with their start and end timestamps.",
      "Review the calculated overall uptime percentage and total accumulated downtime.",
      "Check whether your service has breached or maintained its target SLA commitment."
    ],
    useCases: [
      {
        title: "SaaS Platform Availability Tracking",
        content: "Cloud software providers promise high availability (e.g. 'three nines' or 99.9%). Engineering teams track incident logs to identify whether server outages violate their legal uptime guarantees."
      },
      {
        title: "Telecom SLA Compliance Audits",
        content: "Telecommunication networks guarantee voice and data link availability. If a provider experiences fiber cuts, the customer uses downtime logs to claim service credits based on SLA breaches."
      },
      {
        title: "Web Hosting Reliability Audits",
        content: "E-commerce store operators monitor web host availability. Calculating monthly downtime helps them evaluate hosting packages and decide when to upgrade to redundant server infrastructures."
      }
    ],
    internalLinksText: "To monitor SLA incident resolution countdowns, use the SLA Breach Countdown Calculator. For project management timelines, try the Gantt Chart Date Calculator. To log time durations directly, use the Time Duration Calculator.",
    relatedToolSlugs: [
      "sla-countdown-timer",
      "gantt-chart-date-calculator",
      "time-duration-calculator"
    ],
    faqs: [
      {
        question: "What does 'three nines' or 99.9% uptime mean?",
        answer: "A 99.9% uptime target allows a maximum of 43 minutes and 49 seconds of downtime per month, or 8 hours, 45 minutes, and 57 seconds of downtime per year. Higher availability levels reduce this window dramatically."
      },
      {
        question: "How is service uptime percentage calculated?",
        answer: "Service uptime percentage is calculated using the formula: Uptime % = ((Total Time - Downtime) / Total Time) x 100. Total Time represents the overall length of the monitoring window, and Downtime is the sum of all outage durations."
      },
      {
        question: "What is the difference between scheduled and unscheduled downtime?",
        answer: "Unscheduled downtime refers to unexpected server crashes or network outages. Scheduled downtime represents pre-announced maintenance windows. Many SLAs exclude scheduled maintenance from the uptime calculation, measuring availability only during active business periods."
      }
    ]
  }
};
