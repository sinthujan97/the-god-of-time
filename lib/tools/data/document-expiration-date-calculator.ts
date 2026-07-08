import { ToolPageData } from "../toolPageData";

export const documentExpirationDateCalculatorData: ToolPageData = {
  slug: "document-expiration-date-calculator",
  name: "Document Expiration Date Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Calculate document disposal and archiving dates based on creation dates and regulatory compliance periods.",

  seo: {
    title: "Document Expiration Date Calculator | Free Tool",
    metaDescription: "Free document expiration date calculator. Find when any document expires based on issue date and validity period. Works for all document types. No signup required.",
    introText:
      "This document expiration date calculator finds exactly when a document expires by adding its validity period to its issue date, turning a manual date-math exercise into an instant lookup. Use it as an expiry date calculator online for anything with a validity window — a document due date calculator workflow that works identically whether you're tracking a single passport or an entire filing cabinet of compliance records — and calculate expiration date results down to the exact day remaining. HR departments tracking employee ID documents, compliance teams monitoring regulatory paperwork, immigration lawyers managing visa timelines, and mortgage processors verifying document validity all rely on getting this date exactly right.",
    howToTitle: "How to Calculate a Document Expiration Date",
    howToSteps: [
      "Enter the document's issue date — the date it was originally granted or created.",
      "Enter the validity period, such as 10 years for a passport or 1 year for a visa.",
      "Read the exact expiration date and the number of days remaining until expiry."
    ],
    useCases: [
      {
        title: "Common Document Expiration Periods",
        content:
          "Validity periods vary widely by document type and issuing authority, which is exactly why a quick reference matters when you're tracking documents across categories. A US adult passport is valid for 10 years, while a US passport issued to someone under 16 is valid for only 5 years. A UK passport also runs 10 years for adults. Driving licence validity varies significantly by country and sometimes by the license holder's age. Work visas typically run 1 to 3 years depending on the visa category and issuing country. Professional certifications commonly require renewal every 1 to 3 years to stay current. Insurance certificates are frequently reissued annually. Company incorporation documents often require annual renewal filings to remain in good standing. Because these periods differ so much by document type, jurisdiction, and even the holder's age, the safest approach is always to enter the specific validity period stated on the document itself rather than assuming a standard timeframe applies."
      }
    ],
    faqs: [
      {
        question: "How do I calculate the expiration date of a document?",
        answer:
          "Add the document's validity period to its issue date. For a passport issued on March 15, 2020 with a 10-year validity, the expiration date is March 15, 2030. Enter the issue date and validity period in the calculator for an instant result including exact days remaining until expiry."
      },
      {
        question: "What is the difference between an expiration date and an expiry date?",
        answer:
          "Expiration date and expiry date mean the same thing — the date after which a document is no longer valid. Expiration date is the preferred term in American English while expiry date is more common in British English and Commonwealth countries. Both terms appear on documents depending on the issuing country."
      },
      {
        question: "Can I batch calculate expiration dates for multiple documents?",
        answer:
          "For batch calculations, run the calculator once for each document and record the results. Enter the issue date and validity period for each document separately. Future versions of this tool will support multiple simultaneous entries. For large batches, the CSV export feature allows bulk processing."
      },
      {
        question: "What factors influence the expiration date of legal documents?",
        answer:
          "Key factors include: the type of document and its standard validity period, the issuing authority's rules, the holder's age (some documents have shorter validity for minors), and any conditions attached to the document such as visa status or employment. Some documents also carry a grace period after the official expiry for renewal purposes."
      },
      {
        question: "How do I determine the expiration date of a certified document?",
        answer:
          "Most certified documents state their validity period explicitly — look for \"valid for\" or \"expires\" on the document face. If not stated, check the issuing authority's guidelines for that document type. Professional certifications typically expire 1-3 years from the issue date unless a renewal is completed before expiry."
      },
      {
        question: "What should I do if my document has no expiration date listed?",
        answer:
          "Documents with no stated expiration date are typically valid indefinitely or until a change in circumstances invalidates them (such as a change of name or address). However, verify with the issuing authority as some documents have implicit expiration rules not printed on the document itself. Government-issued IDs sometimes require periodic renewal regardless of printed expiry."
      }
    ],
    internalLinksText:
      "To add any number of days to a document issue date, use the Add Days to Date Tool. To count days remaining until a document expires, try the Days Until Counter. To calculate business days for document renewal windows, see the Business Days Calculator.",
    relatedToolSlugs: [
      "add-days-to-date",
      "days-until-counter",
      "business-days-calculator"
    ]
  }
};
