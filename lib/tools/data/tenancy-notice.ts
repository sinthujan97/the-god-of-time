import { ToolPageData } from "../toolPageData";

export const tenancyNoticeData: ToolPageData = {
  slug: "tenancy-notice",
  name: "Statutory Tenancy Notice Planner",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#E87C7C",
  description: "Find legal dates for giving notice to terminate standard residential lease periods without breach.",
  
  seo: {
    title: "Tenancy Notice Period Planner | Real Estate Leasing Contract Expirations",
    metaDescription: "Calculate the exact deadline date required to serve a legally binding real estate property vacancy notice under leasing terms.",
    introText: "The Statutory Tenancy Notice Planner computes critical notice deadlines. By selecting a target vacate date and inputting the contract notice duration in days, it isolates the latest calendar date to legally serve notice.",
    howToTitle: "How to Plan Resignations",
    howToSteps: [
      "Select your desired lease end date using the calendar picker.",
      "Input the required notice period in days (e.g., 30, 60, or 90 days).",
      "Observe the latest valid notice date displayed.",
      "Track the notice buffer countdown days remaining."
    ],
    useCases: [
      {
        title: "Residential Lease Terminations",
        content: "Determine when to email your landlord to end a month-to-month lease without risking security deposits."
      },
      {
        title: "Commercial Property Vacancies",
        content: "Calculate notice deadlines for warehouse or office leases that require a 90-day warning."
      },
      {
        title: "Apartment Sublet Coordination",
        content: "Coordinate timelines for subletting your apartment to ensure notice matches master lease conditions."
      }
    ],
    internalLinksText: "To audit interest day-counts, check the Interest Day-Count Calculator. To calculate loan maturities, use the Loan Maturity Date Calculator.",
    relatedToolSlugs: [
      "interest-day-count",
      "loan-maturity-date",
      "age-calculator"
    ],
    faqs: [
      {
        question: "Why is a notice buffer countdown important?",
        answer: "It indicates how many days you have left to serve notice. Missing this window can automatically renew your lease or result in penalties."
      },
      {
        question: "Does the calculator support business days only?",
        answer: "Lease notices are generally calculated in calendar days. If your lease specifies business days, check if local regulations adjust deadlines falling on weekends."
      },
      {
        question: "What is the best way to serve a notice?",
        answer: "Leases usually require written notice via email, registered mail, or portal upload to create a legal record of the date served."
      }
    ]
  }
};
