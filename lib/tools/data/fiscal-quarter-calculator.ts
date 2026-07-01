import { ToolPageData } from "../toolPageData";

export const fiscalQuarterCalculatorData: ToolPageData = {
  slug: "fiscal-quarter-calculator",
  name: "Fiscal Quarter & Year Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Map any calendar date to its corresponding corporate fiscal quarter and fiscal year, supporting custom starts.",
  
  seo: {
    title: "Fiscal Quarter & Year Calculator | Corporate Calendar Planner",
    metaDescription: "Determine the fiscal quarter (Q1-Q4) and fiscal year for any date. Supports custom fiscal start months (e.g. October for US government, February for retail).",
    introText: "The Fiscal Quarter & Year Calculator determines the exact fiscal period for any calendar date. Because many corporations, universities, and governments align their financial years on custom schedules (such as starting October 1st or April 1st), this calculator converts Gregorian dates into corporate quarters (Q1, Q2, Q3, Q4) and corresponding fiscal years.",
    howToTitle: "How to Calculate Fiscal Quarters",
    howToSteps: [
      "Select the date you want to analyze using the calendar picker.",
      "Specify the start month of your organization's fiscal year (e.g., January for standard, October for US Federal Govt).",
      "Choose the fiscal year naming convention (whether the FY is named after the starting calendar year or ending calendar year).",
      "Read the calculated fiscal quarter (Q1-Q4), fiscal year (FY), and period start/end dates.",
      "Review the breakdown of days elapsed and days remaining in the current fiscal quarter."
    ],
    useCases: [
      {
        title: "Corporate Financial Reporting",
        content: "Finance teams reconcile ledgers and publish public earnings reports based on fiscal calendars. Aligning transaction dates to the correct fiscal quarter ensures compliance with GAAP and SEC standards."
      },
      {
        title: "Sales Target & Commission Tracking",
        content: "Sales departments establish quotas on a quarterly basis. Calculating the start and end dates of quarters helps set clear deadlines for sales cycles and calculate commission payouts."
      },
      {
        title: "Government Contracting & Budgeting",
        content: "The United States federal government operates on a fiscal year starting October 1st. Contractors and federal agencies use fiscal calculators to monitor spending thresholds before the year-end deadline."
      }
    ],
    internalLinksText: "To plan invoice payment schedules, use the Invoice Due Date & Aging Calculator. For overall business timeline scheduling, try the Project Deadline Back-Planner. For project milestone buffers, check the Milestone Buffer & Risk Calculator.",
    relatedToolSlugs: [
      "invoice-due-date-calculator",
      "project-back-planner",
      "milestone-buffer-calculator"
    ],
    faqs: [
      {
        question: "What is a fiscal year (FY)?",
        answer: "A fiscal year is a 12-month period used by a company or government for budgeting, auditing, and financial reporting. It does not necessarily align with the calendar year (January 1 to December 31)."
      },
      {
        question: "How do fiscal quarters break down?",
        answer: "Every fiscal year is divided into four quarters, each lasting exactly three months. Q1 comprises the first three months of the fiscal year, Q2 the next three, Q3 the following three, and Q4 the final three months."
      },
      {
        question: "How are fiscal year names determined when they cross calendar years?",
        answer: "If a fiscal year starts in July 2025 and ends in June 2026, it is typically referred to as FY2026 (naming after the ending calendar year). However, some organizations name it after the starting calendar year. The calculator supports both conventions."
      }
    ]
  }
};
