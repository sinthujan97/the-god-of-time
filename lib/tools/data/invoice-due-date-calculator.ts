import { ToolPageData } from "../toolPageData";

export const invoiceDueDateCalculatorData: ToolPageData = {
  slug: "invoice-due-date-calculator",
  name: "Invoice Due Date & Aging Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Calculate payment deadlines based on issue date and net terms, and track overdue aging buckets.",
  
  seo: {
    title: "Invoice Due Date & Aging Calculator | Net Terms Planner",
    metaDescription: "Calculate invoice payment due dates based on issue dates and net terms (Net 30, Net 60, etc.). Track aging buckets and days overdue for receivables.",
    introText: "The Invoice Due Date & Aging Calculator is a credit control tool for small business owners, freelancers, and accounts receivable teams. By entering invoice issue dates, payment terms (such as Net 15, Net 30, Net 60, or End of Month), and current status, the calculator projects due dates and assigns outstanding invoices to standard aging buckets.",
    howToTitle: "How to Calculate Invoice Due Dates and Aging",
    howToSteps: [
      "Select the official invoice issue date.",
      "Choose a standard payment term (Net 15, Net 30, Net 45, Net 60) or input custom terms.",
      "Enter the invoice amount and select whether it is paid, pending, or overdue.",
      "Review the calculated payment deadline and number of days remaining until the invoice is due.",
      "Check the aging classification (e.g. 1-30 days overdue, 31-60 days overdue) for cash flow planning."
    ],
    useCases: [
      {
        title: "Accounts Receivable Aging Audits",
        content: "Finance managers review outstanding invoices quarterly. Categorizing unpaid invoices into aging buckets (30, 60, 90+ days) identifies credit risks and guides collection efforts."
      },
      {
        title: "Freelance Cash Flow Projections",
        content: "Freelancers set terms for different clients. Projecting exact payment due dates helps them forecast monthly income and ensure they have cash reserves to cover operational expenses."
      },
      {
        title: "Accounts Payable Planning",
        content: "Purchasing departments track vendor invoices to ensure payments occur on the actual due date, maximizing interest on cash reserves while avoiding late payment fees."
      }
    ],
    internalLinksText: "To calculate billable client hours, try the Billable Hours Tracker. For quarterly corporate timelines, check the Fiscal Quarter & Year Calculator. For day intervals, use the Days Between Dates Calculator.",
    relatedToolSlugs: [
      "billable-hours-tracker",
      "fiscal-quarter-calculator",
      "days-between-dates"
    ],
    faqs: [
      {
        question: "What does 'Net 30' mean on an invoice?",
        answer: "Net 30 indicates that the client has exactly 30 calendar days from the invoice issue date to pay the full balance. Other terms like Net 15 or Net 60 follow the same day-count logic."
      },
      {
        question: "How does the 'End of Month' (EOM) term work?",
        answer: "EOM terms dictate that payment is due a specific number of days after the end of the month in which the invoice was issued. For example, 'Net 30 EOM' for an invoice issued on October 15th sets the due date 30 days after October 31st (November 30th)."
      },
      {
        question: "What are aging buckets in business accounting?",
        answer: "Aging buckets are periods used to classify outstanding accounts receivable (unpaid customer invoices). Common buckets are Current, 1-30 days past due, 31-60 days past due, 61-90 days past due, and 90+ days past due."
      }
    ]
  }
};
