import { ToolPageData } from "../toolPageData";

export const crossBorderDeadlineCalculatorData: ToolPageData = {
  slug: "cross-border-deadline-calculator",
  name: "Cross-Border Deadline Calculator",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#D8F870",
  description: "Calculate legal filing deadlines across multiple jurisdictions with time zone and holiday support.",

  seo: {
    title: "Cross-Border Deadline Calculator | Legal Tool",
    metaDescription: "Free cross-border deadline calculator. Calculate court and legal filing deadlines across multiple jurisdictions with time zone and holiday support. No signup required.",
    introText:
      "This cross-border deadline calculator computes legal filing deadlines that span multiple countries or jurisdictions, correctly accounting for differing time zones, public holiday calendars, and business day rules. A single deadline rule — such as '30 days from service' — can produce very different actual filing dates once you factor in the target jurisdiction's holidays and whether the rule counts calendar days or business days only. Built as a legal deadline calculator for tracking international filing deadlines, this tool helps international lawyers, legal teams, compliance officers, and cross-border litigators avoid the costly mistake of miscalculating court deadlines across borders.",
    howToTitle: "How to Calculate Cross-Border Deadlines",
    howToSteps: [
      "Enter the trigger date and the jurisdiction where the triggering event occurred (e.g., date of service).",
      "Add the applicable deadline rule — for example, 30 calendar days, or 21 business days only.",
      "Review the calculated deadline, adjusted for the target jurisdiction's time zone and holiday calendar, shown in both local and UTC time."
    ],
    useCases: [
      {
        title: "Why Cross-Border Deadlines Are Complicated",
        content:
          "Legal deadlines that cross national or state borders carry hidden complexity that purely domestic deadlines don't face. First, different jurisdictions count days using different conventions — some count every calendar day toward a deadline, while others count only court days or business days, excluding weekends and public holidays entirely. Second, time zone cutoffs matter more than they first appear: a filing deadline of 5:00 PM Eastern Time represents a completely different moment in UTC than 5:00 PM Greenwich Mean Time, and a court clerk's office closing time in one jurisdiction may fall well outside business hours in another. Third, public holiday calendars vary significantly by country, and even by state or province within a country, so a deadline that falls on an ordinary business day in one jurisdiction may land squarely on a public holiday in the other, potentially shifting the effective deadline. The stakes of getting this wrong are serious — missing a cross-border filing deadline can mean losing a case entirely, forfeiting a legal right, or incurring financial penalties, which is exactly why international legal teams rely on a dedicated calculator rather than manual jurisdiction-by-jurisdiction arithmetic."
      }
    ],
    faqs: [
      {
        question: "How does the cross-border deadline calculator work?",
        answer:
          "Enter your trigger date, the applicable deadline rule (such as 30 calendar days or 21 business days), and the target jurisdiction. The calculator adjusts the deadline for the correct time zone, excludes public holidays in the relevant jurisdiction, and shows the final filing deadline in both local and UTC time."
      },
      {
        question: "What factors are considered in cross-border deadline calculations?",
        answer:
          "The calculator accounts for: the trigger event date and time, whether the rule uses calendar days or business days, the public holiday calendar of the target jurisdiction, the time zone of the filing deadline, and whether the deadline falls on a weekend or holiday (which typically shifts it to the next business day)."
      },
      {
        question: "Can I use this for multiple jurisdictions?",
        answer:
          "Yes. Calculate the deadline independently for each jurisdiction. If a filing must be made in multiple countries simultaneously, calculate each separately and use the earliest deadline as your target. International litigation often requires tracking deadlines in two or more legal systems at the same time."
      },
      {
        question: "How do international holidays affect my deadlines?",
        answer:
          "If a deadline falls on a public holiday in the target jurisdiction, it typically moves to the next business day. This rule varies by jurisdiction and court rules. Always verify the applicable rule for your specific court or regulatory body, as local procedural rules can override the general principle."
      },
      {
        question: "What are some examples of cross-border deadline scenarios?",
        answer:
          "Common scenarios include: a 30-day response deadline in a US court triggered by service of process in the UK; an EU regulatory filing deadline triggered by a US corporate action; and a treaty arbitration notice period that must be filed in a third country. Each scenario requires combining the trigger jurisdiction's calendar with the filing jurisdiction's rules."
      }
    ],
    internalLinksText:
      "To calculate domestic court filing deadlines, use the Court Deadline & Legal Calendar Calculator. To count business days between any two dates, try the Business Days Calculator. To convert deadline times across time zones, see the World Time Zone Converter.",
    relatedToolSlugs: [
      "court-deadline-calculator",
      "business-days-calculator",
      "world-time-converter"
    ]
  }
};
