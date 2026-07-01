import { ToolPageData } from "../toolPageData";

export const interestDayCountData: ToolPageData = {
  slug: "interest-day-count",
  name: "Interest Day-Count Calculator",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#B2D828",
  description: "Calculate standard commercial interest accrual day counts and statement calendar fractions using industry conventions.",
  
  seo: {
    title: "Interest Day Count Calculator | Financial Security Statement Day Math",
    metaDescription: "Calculate standard commercial interest accrual day counts and statement calendar fractions using industry-standard day-count conventions.",
    introText: "The Interest Day-Count Calculator computes days and interest fractions between statement dates. Enforcing standards like ACT/360, ACT/365, or 30/360, it assists finance analysts, traders, and accountants with audit calculations.",
    howToTitle: "How to Calculate Interest Days",
    howToSteps: [
      "Select the statement start date.",
      "Select the statement end date.",
      "Choose the day-count convention from the dropdown (ACT/360, ACT/365, or 30/360).",
      "Read the precise exact day count and calculated year fraction."
    ],
    useCases: [
      {
        title: "Bond Yield Calculations",
        content: "Calculate accrued interest for corporate bonds using the 30/360 NASD day-count standard."
      },
      {
        title: "Commercial Loan Audits",
        content: "Verify interest payments for loans calculated on an ACT/360 basis, where the year is treated as 360 days."
      },
      {
        title: "Treasury Note Yield Checks",
        content: "Compute yields for government securities utilizing the ACT/365 convention."
      }
    ],
    internalLinksText: "To calculate mortgage maturity dates, use the Loan Maturity Date Calculator. To plan tenancy vacating periods, check the Statutory Tenancy Notice Planner.",
    relatedToolSlugs: [
      "loan-maturity-date",
      "tenancy-notice",
      "age-calculator"
    ],
    faqs: [
      {
        question: "What is a day-count convention?",
        answer: "It is a standard method used in finance to determine how interest accrues over time, specifying how days are counted in a month and year."
      },
      {
        question: "Why does the ACT/360 convention exist?",
        answer: "ACT/360 counts the actual days in the accrual period but assumes a 360-day year. This yields slightly higher interest payments than a 365-day year, which is standard in commercial bank lending."
      },
      {
        question: "How does the 30/360 convention handle calendar differences?",
        answer: "Under 30/360, every month is treated as having exactly 30 days, and the year as 360 days, simplifying manual calculations by eliminating varying month lengths."
      }
    ]
  }
};
