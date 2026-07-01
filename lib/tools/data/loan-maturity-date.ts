import { ToolPageData } from "../toolPageData";

export const loanMaturityDateData: ToolPageData = {
  slug: "loan-maturity-date",
  name: "Loan Maturity Date Calculator",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#B2D828",
  description: "Calculate the exact final maturity date of a financial loan or mortgage based on term parameters.",
  
  seo: {
    title: "Loan Maturity Date Calculator | Amortization Schedule Expiration Calendars",
    metaDescription: "Calculate the exact final repayment maturity expiration date of a commercial financial loan based on its origination parameters.",
    introText: "The Loan Maturity Date Calculator establishes the final expiration date of financial agreements. By mapping origination dates and duration terms, it projects maturity timelines for home loans, car notes, and bonds.",
    howToTitle: "How to Calculate Maturity Dates",
    howToSteps: [
      "Select the origination date of the loan using the datepicker.",
      "Input the total loan term in months (e.g. 360 for a 30-year mortgage).",
      "View the exact final repayment maturity date.",
      "Check the countdown of remaining days until the agreement concludes."
    ],
    useCases: [
      {
        title: "Mortgage Refinancing Checks",
        content: "Determine your exact maturity threshold to time refinancing applications without early payoff penalties."
      },
      {
        title: "Bond Investment Portfolios",
        content: "Align maturity dates for Treasury bonds or corporate certificates to secure steady cash flows."
      },
      {
        title: "Commercial Lease Auditing",
        content: "Track business loan agreements to plan capital allocations before balloons or standard payouts occur."
      }
    ],
    internalLinksText: "To calculate day-count fractions, use the Interest Day-Count Calculator. To calculate leasing notice deadlines, check the Statutory Tenancy Notice Planner.",
    relatedToolSlugs: [
      "interest-day-count",
      "tenancy-notice",
      "age-calculator"
    ],
    faqs: [
      {
        question: "What is a loan maturity date?",
        answer: "The maturity date is the scheduled calendar day when the final installment payment of a loan is due, ending the active contract."
      },
      {
        question: "How does the tool handle partial months?",
        answer: "The calculator adds calendar months directly to the origination date. If origination occurs on the 31st and the target month has only 30 days, it lands on the 30th."
      },
      {
        question: "Can I use this for interest-only balloon loans?",
        answer: "Yes, maturity date projections depend entirely on term lengths, regardless of amortization structures."
      }
    ]
  }
};
