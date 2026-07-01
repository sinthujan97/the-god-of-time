import { ToolPageData } from "../toolPageData";

export const documentRetentionExpiryData: ToolPageData = {
  slug: "document-retention-expiry",
  name: "Document Retention Expiry Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Calculate document disposal and archiving dates based on creation dates and regulatory compliance periods.",
  
  seo: {
    title: "Document Retention Expiry Calculator | Compliance Disposal Planner",
    metaDescription: "Calculate compliance disposal, destruction, and archiving dates for financial, medical, and legal records based on statutory retention rules.",
    introText: "The Document Retention Expiry Calculator helps legal, financial, and HR departments track document lifecycles. By entering a document's creation or closing date and selecting standard regulatory policies (e.g. IRS tax records, HIPAA medical history, OSHA incident logs), the tool projects the precise destruction and archiving dates.",
    howToTitle: "How to Calculate Document Retention Expiry",
    howToSteps: [
      "Select the document's date of origin or closing date.",
      "Choose a preconfigured document type (Tax Records, Employment Files, Medical Records, Customer Contracts).",
      "Customize the retention period in years if you have custom corporate policies.",
      "Select whether to calculate the destruction date based on the exact anniversary or the end of the fiscal year.",
      "Review the calculated retention expiration date and current active status (retrained vs. ready for disposal)."
    ],
    useCases: [
      {
        title: "Corporate Tax and Financial Audits",
        content: "The IRS requires companies to retain tax returns and receipts for a minimum of 3 to 7 years. Accurate retention calculation prevents premature document shredding or unnecessary storage costs."
      },
      {
        title: "HR Employee File Management",
        content: "Personnel files, payroll records, and benefit sheets have different statutory retention limits. The calculator maps retention schedules to ensure compliance with federal and state labor standards."
      },
      {
        title: "Healthcare Medical Records Tracking",
        content: "Under HIPAA and state guidelines, medical providers must retain patient files for specific durations (often 6 to 10 years). Planning destruction dates protects patient privacy and ensures compliance."
      }
    ],
    internalLinksText: "To plan project archiving dates, try the Project Deadline Back-Planner. For standard date interval math, check the Days Between Dates Calculator. For fiscal year alignment, use the Fiscal Quarter & Year Calculator.",
    relatedToolSlugs: [
      "project-back-planner",
      "days-between-dates",
      "fiscal-quarter-calculator"
    ],
    faqs: [
      {
        question: "What is a document retention period?",
        answer: "A document retention period is the duration an organization is legally or operationally required to keep records before destroying or archiving them. These periods are dictated by local laws, industry regulations, and business utility."
      },
      {
        question: "Why do some retention schedules end at the fiscal year-end?",
        answer: "Many regulations state that records must be kept for 'X years from the date of filing or the end of the tax year, whichever is later.' Calculating from the end of the fiscal year ensures compliance safety and simplifies batch shredding cycles."
      },
      {
        question: "What happens if a legal hold is placed on documents?",
        answer: "If a legal hold is issued due to pending litigation, the retention expiration date is immediately suspended. Documents must not be destroyed, regardless of their calculated retention expiry, until the hold is officially lifted."
      }
    ]
  }
};
