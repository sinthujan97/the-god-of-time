import { ToolPageData } from "../toolPageData";

export const freeLegalDeadlineCalculatorData: ToolPageData = {
  slug: "free-legal-deadline-calculator",
  name: "Free Legal Deadline Calculator",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Calculate legal filing deadlines, accounting for business days, court holidays, and weekend rules — completely free.",

  seo: {
    title: "Free Legal Deadline Calculator | Court Dates Tool",
    metaDescription: "Free legal deadline calculator. Calculate court filing deadlines in calendar or business days. Accounts for weekends and holidays. No signup required.",
    introText:
      "This free legal deadline calculator computes court and legal filing deadlines from a trigger date in calendar days, business days, or court days — no subscription, no paywall, and no signup required. Unlike paid legal calendaring tools that lock this exact calculation behind a subscription, this court filing deadline calculator gives attorneys, paralegals, legal assistants, and pro se litigants the same core functionality at no cost. If you've ever wondered how to calculate court deadlines correctly when weekends and holidays are involved, this legal due date calculator applies the standard adjustment rules automatically so you don't have to count days by hand on a paper calendar.",
    howToTitle: "How to Calculate Legal Deadlines",
    howToSteps: [
      "Enter the trigger date — such as the date of service, filing, or judgment.",
      "Enter the deadline rule, such as 30 calendar days, and specify whether it counts calendar days, business days, or court days (these differ by jurisdiction and rule).",
      "Review the deadline date, automatically adjusted forward to the next business day if it falls on a weekend or holiday."
    ],
    useCases: [
      {
        title: "Calendar Days vs Business Days in Legal Deadline Calculations",
        content:
          "The single biggest source of legal deadline miscalculation is confusing the three different day-counting conventions courts use. Calendar days count every single day toward the deadline, including weekends and holidays — the most common default under many procedural rules. Business days exclude Saturdays, Sundays, and federal holidays entirely, so a 10-business-day deadline can span nearly three calendar weeks depending on where the holidays fall. Court days exclude only the days a specific court is actually closed, which is jurisdiction-specific and can differ from the general federal or state holiday calendar. Under the Federal Rules of Civil Procedure, most deadlines use calendar days, but with an important nuance: the triggering day itself is excluded from the count, and if the final day lands on a non-court day, the deadline moves to the next day the court is open. State courts vary considerably from this federal approach and from each other, which is exactly why you should always verify the specific local rule governing your filing rather than assuming the federal convention applies."
      }
    ],
    faqs: [
      {
        question: "What is a legal deadline calculator?",
        answer:
          "A legal deadline calculator computes the date by which a legal action must be taken based on a triggering event date and a specified number of days under applicable procedural rules. It accounts for whether the rule uses calendar days or business days and adjusts the final date when it falls on a weekend or court holiday."
      },
      {
        question: "How do I calculate legal deadlines using this tool?",
        answer:
          "Enter the date of the triggering event (such as the date of service or filing), select whether the applicable rule counts calendar days or business days, enter the number of days specified in the rule, and select your jurisdiction for holiday exclusions. The calculator shows the deadline date and flags whether it was adjusted for a weekend or holiday."
      },
      {
        question: "Does the calculator account for weekends and holidays?",
        answer:
          "Yes. When a calculated deadline falls on a Saturday, Sunday, or federal holiday, the calculator automatically moves the deadline to the next business day. For state court deadlines, select your state to apply the correct holiday calendar. Always verify against your local court rules as some jurisdictions have additional holidays not included in federal calendars."
      },
      {
        question: "Can I adjust the calculator for different states?",
        answer:
          "Yes. Select your state from the jurisdiction dropdown to apply state-specific holiday calendars. State holidays vary significantly — for example, Patriots Day in Massachusetts, Cesar Chavez Day in California, and Mardi Gras in Louisiana. Federal court deadlines use the federal holiday calendar regardless of state."
      },
      {
        question: "What happens if I miss a legal deadline?",
        answer:
          "Missing a legal deadline can have severe consequences including dismissal of your case, default judgment against you, loss of your right to appeal, or malpractice liability for attorneys. If you have missed or are about to miss a deadline, contact an attorney immediately to discuss options such as a motion for extension of time or excusable neglect relief."
      },
      {
        question: "How accurate is the legal deadline calculator?",
        answer:
          "The calculator applies general deadline calculation rules and common holiday calendars. It is a planning tool — not a substitute for legal advice or verification against the specific procedural rules governing your case. Always confirm calculated deadlines against the applicable court rules and local rules before relying on them for actual filings."
      }
    ],
    internalLinksText:
      "To count business days for legal notice periods, use the Business Days Calculator. To calculate deadlines across multiple jurisdictions, try the Cross-Border Deadline Calculator. To calculate the number of days between two legal dates, see the Days Between Dates Calculator.",
    relatedToolSlugs: [
      "business-days-calculator",
      "cross-border-deadline-calculator",
      "days-between-dates"
    ]
  }
};
