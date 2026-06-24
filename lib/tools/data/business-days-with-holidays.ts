import { ToolPageData } from "../toolPageData";

export const businessDaysWithHolidaysData: ToolPageData = {
  slug: "business-days-with-holidays",
  name: "Business Days + Custom Holidays",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Calculate business days factoring in custom national or corporate holidays.",
  
  seo: {
    title: "Business Days with Holidays Calculator | Custom Working Days",
    metaDescription: "Calculate the exact number of business days between two dates, including or excluding custom national, bank, or corporate holidays. Free and online.",
    introText: "The Business Days with Holidays Calculator enables you to count the exact number of working days between any two dates, factoring in not just weekends, but also a custom list of holidays. Ideal for project planning, payroll processing, and legal calculations across various regions, this calculator helps you avoid generic assumptions and specify custom dates that should be excluded from your business day counts.",
    howToTitle: "How to Calculate Business Days with Holidays",
    howToSteps: [
      "Select your start date and end date.",
      "Add custom holiday dates using the dynamic list. Use the 'Add Holiday' button to add as many corporate, federal, or region-specific holidays as needed.",
      "Read the result instantly. The breakdown will show total calendar days, weekends excluded, and the number of weekdays that were subtracted as holidays."
    ],
    useCases: [
      {
        title: "For Regional or National Public Holidays",
        content: "If you operate across different states, countries, or regions (such as the UK, US, or EU), public holidays vary significantly. Manually inputting bank holidays for your specific locale ensures your working day calculations remain 100% compliant."
      },
      {
        title: "For Corporate Office Closures",
        content: "Many companies observe custom company holidays, shutdown weeks during the holidays, or unique training days. Excluding these custom company closures gives a realistic representation of product delivery dates."
      },
      {
        title: "For Legal and Court Filings",
        content: "Court filing limits and procedural deadlines often state that if a deadline falls on a holiday (custom to the court's jurisdiction), it shifts. Calculating working days while factoring in court-specific holidays prevents missing key filing windows."
      }
    ],
    internalLinksText: "To count business days without inputting custom holidays, use the standard Business Days Calculator. To count all calendar days between two dates, use the Days Between Dates Calculator.",
    relatedToolSlugs: [
      "business-days-calculator",
      "days-between-dates",
      "add-days-to-date"
    ],
    faqs: [
      {
        question: "What happens if a custom holiday falls on a weekend?",
        answer: "If a holiday falls on a Saturday or Sunday, the calculator handles it correctly. It is already counted as a weekend day, so it will not be double-deducted, ensuring your total business days count remains accurate."
      },
      {
        question: "Can I add multiple custom holidays?",
        answer: "Yes. You can add as many custom holiday dates as needed. The list is dynamic and allows you to add or remove slots on the fly."
      },
      {
        question: "Are national holidays pre-loaded?",
        answer: "This tool is designed to work globally with custom rules, so holidays are not pre-loaded. This allows you to input exactly the holidays that apply to your corporate calendar or local region."
      }
    ]
  }
};
