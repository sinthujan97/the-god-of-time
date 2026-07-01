import { ToolPageData } from "../toolPageData";

export const crossBorderDeadlineData: ToolPageData = {
  slug: "cross-border-deadline",
  name: "Cross-Border Deadline Matcher",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#D8F870",
  description: "Compare operational and transactional deadlines across international boundaries to avoid late submissions.",
  
  seo: {
    title: "Cross-Border Deadline Matcher | International Transaction Coordinator",
    metaDescription: "Synchronize transaction and document submission deadlines across multiple global branches. Check relative day shifts and times.",
    introText: "The Cross-Border Deadline Matcher is a professional compliance tool. In global business, a deadline specified as '5:00 PM local time' in one branch occurs at a completely different hour elsewhere. This calculator lets you select a source deadline and map its exact equivalents to target branches.",
    howToTitle: "How to Match Global Deadlines",
    howToSteps: [
      "Select the target deadline date and local time of the host branch.",
      "Choose the host branch timezone (source zone).",
      "Add the timezones of your partner offices or target nodes.",
      "Review the comparison matrix. Check for day shifts (e.g. +1 Day) to prevent missed filings."
    ],
    useCases: [
      {
        title: "Financial Settlement Cuts",
        content: "Ensure wiring instructions are submitted in London before the corresponding 4:00 PM settlement clock closes in New York."
      },
      {
        title: "Tender and Proposal Submissions",
        content: "Verify exact local deadlines for international government bids to avoid disqualified late uploads."
      },
      {
        title: "Academic Paper Submissions",
        content: "Confirm if a university application deadline in California means you must submit on a Friday or Saturday in Paris."
      }
    ],
    internalLinksText: "To find ideal working overlaps for discussions, use the Meeting Planner Sweet-Spot Finder. To translate 24h files, check the Military Time Converter.",
    relatedToolSlugs: [
      "meeting-planner",
      "military-time-converter",
      "world-time-converter"
    ],
    faqs: [
      {
        question: "How do day shifts occur?",
        answer: "If a deadline is scheduled late in the evening in Asia, it translates to the previous day in the Americas. If scheduled early in the morning in the US, it maps to the next day in Sydney."
      },
      {
        question: "Does the tool support bank holiday warnings?",
        answer: "The tool projects absolute calendar times. Users should cross-reference outputs with local national bank calendars."
      },
      {
        question: "Can I print the deadline conversion chart?",
        answer: "Yes, the layout prints clearly as a table, making it easy to include in project spec sheets."
      }
    ]
  }
};
