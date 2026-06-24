import { ToolPageData } from "../toolPageData";

export const subscriptionRenewalScheduleData: ToolPageData = {
  slug: "subscription-renewal-schedule",
  name: "Subscription Renewal & Runway Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#9B8EF5",
  description: "Track subscription payment intervals (monthly/annual) and project cash runway based on recurring costs.",
  
  seo: {
    title: "Subscription Renewal & Runway Calculator | SaaS Expense Tracker",
    metaDescription: "Calculate recurring subscription renewal dates and map cash runway. Track SaaS billing cycles, annual commitment dates, and business expense depletion rates.",
    introText: "The Subscription Renewal & Runway Calculator tracks recurring SaaS subscriptions and contractual commitments. By inputting contract start dates, billing frequencies (monthly, quarterly, or annual), and monthly recurring revenue or cash balances, finance managers can identify renewal schedules and estimate overall runway.",
    howToTitle: "How to Calculate Subscription Renewals & Runway",
    howToSteps: [
      "Add your recurring subscriptions, selecting their start dates and billing periods.",
      "Enter the cost of each subscription (converted to a monthly average value).",
      "Enter your current starting cash balance and average monthly revenue (or cash burn rate).",
      "Click calculate to review upcoming renewal dates in a chronological timeline.",
      "Analyze the cash runway chart showing when cash balance falls to zero."
    ],
    useCases: [
      {
        title: "SaaS Expense Management",
        content: "Startup operations teams track licenses for design tools, servers, CRMs, and email tools. Mapping renewal dates prevents sudden credit card charges and provides visibility into contract cancellation windows."
      },
      {
        title: "Startup Runway Planning",
        content: "Founders track their cash burn against recurring income. Knowing exactly how many months of runway remain before needing additional funding or reaching profitability is vital for strategic decisions."
      },
      {
        title: "Vendor Contract Auditing",
        content: "Corporate procurement teams review subscription agreements annually. Predicting renewal dates 60 days in advance helps renegotiate terms or prepare termination notifications without auto-renew penalties."
      }
    ],
    internalLinksText: "To manage invoice timelines, try the Invoice Due Date & Aging Calculator. For freelance client budgets, check the Freelance Capacity Planner. For custom contract durations, use the Days Between Dates Calculator.",
    relatedToolSlugs: [
      "invoice-due-date-calculator",
      "freelance-capacity-planner",
      "days-between-dates"
    ],
    faqs: [
      {
        question: "What is cash runway in business finance?",
        answer: "Cash runway is the number of months a business can survive before running out of money, calculated by dividing the current cash balance by the net monthly burn rate (total cash outgoing minus cash incoming)."
      },
      {
        question: "How does the tool handle variable billing cycles?",
        answer: "The tool normalizes billing intervals into monthly equivalents (e.g., annual subscriptions are divided by 12, quarterly subscriptions by 3) to create a consistent monthly cash flow projection."
      },
      {
        question: "What is the auto-renewal warning window?",
        answer: "Most enterprise software agreements require cancellation notices 30, 60, or 90 days before the renewal date. The calculator highlights these critical cancellation windows alongside the renewal dates."
      }
    ]
  }
};
