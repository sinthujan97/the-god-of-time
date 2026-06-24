import { ToolPageData } from "../toolPageData";

export const courtDeadlineCalculatorData: ToolPageData = {
  slug: "court-deadline-calculator",
  name: "Court Deadline & Legal Calendar Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#9B8EF5",
  description: "Calculate legal filing deadlines, accounting for business days, court holidays, and weekend rules.",
  
  seo: {
    title: "Court Deadline & Legal Calendar Calculator | Legal Deadline Planner",
    metaDescription: "Calculate legal and court filing deadlines. Exclude federal/state holidays and weekends to ensure compliance with civil procedure rules.",
    introText: "The Court Deadline & Legal Calendar Calculator is a professional tool for attorneys, paralegals, and legal departments. It calculates court filing deadlines by working forward or backward from service or trial dates. It handles weekend rules and official court holidays to prevent late filings and docket errors.",
    howToTitle: "How to Calculate Court Deadlines",
    howToSteps: [
      "Select the trigger date (e.g. the date a motion was served or the trial start date).",
      "Enter the deadline period in days (e.g., 21 days to respond to a complaint).",
      "Choose the direction: add days (forward from service) or subtract days (backward from trial).",
      "Select whether to calculate using calendar days or business/court days.",
      "Toggle court holiday exclusions and review the calculated filing date and warning window."
    ],
    useCases: [
      {
        title: "Civil Litigation Filing Tracking",
        content: "Attorneys calculate answer deadlines, motion filings, and discovery response dates. In civil procedure, missing a deadline by one day can result in a default judgment or motion dismissal."
      },
      {
        title: "Trial Prep Schedule Coordination",
        content: "Legal teams work backward from the trial start date to schedule expert witness disclosures, exhibit lists, and pre-trial briefs, ensuring compliance with local rules."
      },
      {
        title: "Appellate Filing Management",
        content: "Appeals have strict statutory filing windows (often 30 days from final judgment). The legal calendar calculator checks for weekend or holiday falls and moves the deadline to the next business day."
      }
    ],
    internalLinksText: "To plan general business notices, try the Statutory Notice Period Calculator. For backward project timelines, check the Project Deadline Back-Planner. To analyze elapsed time, see the Days Between Dates Calculator.",
    relatedToolSlugs: [
      "statutory-notice-period",
      "project-back-planner",
      "days-between-dates"
    ],
    faqs: [
      {
        question: "How do weekend rules affect legal deadlines?",
        answer: "Under most civil procedure rules (like FRCP Rule 6), if a filing deadline falls on a Saturday, Sunday, or legal holiday, the deadline is extended to the next day that is not a weekend or holiday (usually the following Monday)."
      },
      {
        question: "What is the difference between calendar days and court days?",
        answer: "Calendar days count every consecutive day including weekends. Court days (or business days) exclude weekends and official court holidays. Many jurisdictions specify that if a response period is less than 11 days, only court days are counted."
      },
      {
        question: "Which court holidays are excluded by default?",
        answer: "The calculator excludes standard US Federal Holidays (including New Year's Day, Martin Luther King Jr. Day, Memorial Day, Juneteenth, Independence Day, Labor Day, Thanksgiving, and Christmas) when court holiday exclusions are enabled."
      }
    ]
  }
};
