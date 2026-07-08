import { ToolPageData } from "../toolPageData";

export const fractionalWorkHoursAllocatorData: ToolPageData = {
  slug: "fractional-work-hours-allocator",
  name: "Fractional Work Hours Allocator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Allocate weekly hours and revenues across multiple fractional clients, track capacity utilization, and model income scenarios.",

  seo: {
    title: "Fractional Work Hours Allocator | Free Tool",
    metaDescription: "Free fractional work hours allocator. Plan client hours, track capacity utilization, and model monthly revenues across multiple fractional or consulting engagements.",
    introText:
      "The fractional work hours allocator helps fractional executives, consultants, and multi-client advisors distribute their available working hours across portfolio clients, track total weekly commitments, and model monthly revenue at current billing rates. Fractional work — where one professional provides part-time executive or specialist capacity to multiple organizations simultaneously — requires precise hours planning to avoid over-commitment while maximizing income. Enter your client engagements, weekly hours per client, and billing rates to instantly see your capacity utilization rate, total weekly and monthly revenue, and remaining available hours for new client opportunities.",
    howToTitle: "How to Allocate Fractional Work Hours",
    howToSteps: [
      "Set your maximum weekly working hours — the total hours you are willing to commit across all clients (default is 40 hours).",
      "Add a row for each portfolio client and enter the client name, hours allocated per week, and your hourly rate for that engagement.",
      "Review the weekly and monthly revenue generated per client, your total capacity utilization rate, and remaining available hours.",
      "Adjust allocations until your capacity utilization falls in your target range — typically 80–90% to leave room for new clients and administrative tasks."
    ],
    useCases: [
      {
        title: "What Is Fractional Work?",
        content:
          "Fractional work is a professional model where an experienced executive, consultant, or specialist provides part-time capacity to multiple organizations simultaneously rather than working full-time for a single employer. Common fractional roles include Fractional CFO, Fractional CMO, Fractional CTO, fractional HR director, and fractional sales leader. Typically, each client receives a defined weekly allocation — often 8–16 hours — and the fractional professional maintains 3–5 client relationships at once, generating executive-level income across a diversified portfolio. The major planning challenge is hours allocation: 5 clients at 10 hours each perfectly fills a 50-hour week, but client demand is rarely perfectly predictable. This fractional work hours allocator gives you a visual dashboard of where your hours are going, which clients are your highest revenue contributors per hour, and how much capacity remains for additional engagements."
      },
      {
        title: "Revenue Modeling for Fractional Professionals",
        content:
          "One of the most powerful uses of a fractional work hours allocator is income modeling — answering 'what would my monthly revenue be if I added one more client?' or 'which current client generates the least revenue per hour?'. If you have 3 clients using 30 of your 40 available weekly hours at an average blended rate of $200/hour, your current weekly revenue is $6,000 (× 4.33 weeks = $25,980/month). Adding a fourth client at 8 hours/week and $175/hour adds $1,400/week ($6,062/month) while bringing your utilization to 95% — manageable but near capacity. This calculator lets you run these scenarios in seconds so you can make client acquisition and pricing decisions based on data rather than intuition."
      }
    ],
    faqs: [
      {
        question: "What is a fractional executive?",
        answer:
          "A fractional executive is a senior professional who provides part-time C-suite or leadership capacity to multiple companies simultaneously. Common examples include Fractional CFO, Fractional CMO, and Fractional CTO. Each client receives a defined weekly allocation of the executive's time at an hourly or monthly retainer rate."
      },
      {
        question: "What is capacity utilization in fractional work?",
        answer:
          "Capacity utilization is the percentage of your maximum weekly hours that are allocated to client engagements. At 80% utilization with a 40-hour week, you have 32 hours committed to clients and 8 hours for business development, administration, and pipeline building."
      },
      {
        question: "How many fractional clients can I realistically manage?",
        answer:
          "Most fractional professionals find 3–5 clients sustainable. Below 3 creates income concentration risk. Above 5 often leads to context-switching overhead that reduces effectiveness. The right number depends on engagement intensity — a 20-hour/week client counts heavily against capacity while a 5-hour/week advisory board role does not."
      },
      {
        question: "How is monthly revenue calculated in this tool?",
        answer:
          "Monthly revenue per client is calculated by multiplying the weekly hours allocation by your hourly rate to get weekly revenue, then multiplying by 4.33 (the average number of weeks per month). Total monthly revenue sums all client projections."
      },
      {
        question: "What happens if I allocate more hours than my maximum?",
        answer:
          "When allocated hours exceed your maximum capacity, your utilization rate goes above 100% and remaining available hours display as zero. This signals over-commitment — you should reduce allocations, raise rates to compensate for the overload, or renegotiate scope with one or more clients."
      },
      {
        question: "Can I use this for non-fractional consulting engagements?",
        answer:
          "Yes — this tool works for any multi-client consulting, advisory, or contracting arrangement where you allocate fixed hours per client per week and bill at hourly or retainer rates. The model is the same regardless of whether your title is 'fractional executive' or 'independent consultant.'"
      }
    ],
    internalLinksText:
      "To track retainer hour balances for individual clients, use the Retainer Hours Tracker Online. For general freelance capacity planning and revenue targets, try the Freelance Project Capacity Planner. For logging and invoicing billable hours, see the Billable Hours Tracker.",
    relatedToolSlugs: [
      "freelance-capacity-planner",
      "retainer-hours-tracker-online",
      "billable-hours-tracker"
    ]
  }
};
