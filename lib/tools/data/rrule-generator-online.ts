import { ToolPageData } from "../toolPageData";

export const rruleGeneratorOnlineData: ToolPageData = {
  slug: "rrule-generator-online",
  name: "RRule Generator Online",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Generate standard RFC 5545 iCalendar Recurrence Rules (RRule) and preview upcoming occurrence dates.",

  seo: {
    title: "RRule Generator Online | Free iCal RRULE Tool",
    metaDescription: "Free RRule generator. Create iCal RRULE strings for recurring events. Supports daily, weekly, monthly, yearly recurrence with exceptions. No signup required.",
    introText:
      "This RRule generator online builds RFC 5545 RRULE strings for use in iCalendar (.ics) files, calendar APIs, and scheduling applications, so you never have to hand-write recurrence syntax again. As an iCal RRULE generator, it covers every standard frequency — daily, weekly, monthly, and yearly — plus the interval, count, and until properties that control exactly how a recurrence pattern repeats and ends. Whether you need a quick RRULE string generator for a one-off calendar invite or you're building recurring event logic into a scheduling application, developers, calendar app builders, and event planners using calendar integrations use this tool to get valid RRULE syntax on the first try.",
    howToTitle: "How to Use the RRule Generator",
    howToSteps: [
      "Select your recurrence frequency — daily, weekly, monthly, or yearly.",
      "Configure the interval and, if relevant, specific days of the week or month.",
      "Copy the generated RRULE string for use in your calendar file or application."
    ],
    useCases: [
      {
        title: "RRule Examples for Common Scenarios",
        content:
          "Seeing real RRULE strings side by side with what they mean makes the syntax click far faster than reading the RFC spec. Every weekday is written as FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR — a weekly frequency restricted to the five weekday BYDAY values. Every 2 weeks on Monday becomes FREQ=WEEKLY;INTERVAL=2;BYDAY=MO, where INTERVAL=2 doubles the normal weekly spacing. The first Monday of every month is FREQ=MONTHLY;BYDAY=1MO, using the ordinal prefix on BYDAY to mean 'the first occurrence of this weekday in the period' rather than every matching weekday. The last day of every month is FREQ=MONTHLY;BYMONTHDAY=-1, where the negative value counts backward from the end of the month — a trick that correctly handles months of different lengths without any extra logic. And an annual event on a fixed date, like March 15th every year, is simply FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=15. These five patterns cover the overwhelming majority of recurring event needs in real applications."
      }
    ],
    faqs: [
      {
        question: "What is an RRULE and how is it used?",
        answer:
          "RRULE is a recurrence rule property defined in RFC 5545 (the iCalendar standard) that describes how an event repeats over time. RRULE strings are used in .ics calendar files, calendar APIs (Google Calendar, Microsoft Exchange, Apple Calendar), and scheduling applications to define events like \"every Monday\" or \"the last day of each month.\""
      },
      {
        question: "How do I create a recurring event using the RRULE generator?",
        answer:
          "Select your recurrence frequency (daily, weekly, monthly, or yearly), set the interval between occurrences, specify the days or dates if relevant, and optionally set an end date or occurrence count. The generator produces the RRULE string in real time, which you can copy directly into your calendar application or code."
      },
      {
        question: "What advanced RRULE properties are supported?",
        answer:
          "The generator supports FREQ, INTERVAL, BYDAY, BYMONTH, BYMONTHDAY, BYSETPOS, COUNT, and UNTIL. Advanced properties like BYWEEKNO and BYYEARDAY are available for yearly recurrence. EXDATE and EXRULE for exception handling allow you to exclude specific occurrences from an otherwise regular recurrence pattern."
      },
      {
        question: "Can I export my RRULE to an .ics file?",
        answer:
          "Yes. Click the Export button to download a complete .ics file containing your recurring event definition. You can import this file directly into Google Calendar, Apple Calendar, Outlook, or any RFC 5545-compliant calendar application. The .ics file includes the RRULE plus required event properties like DTSTART."
      },
      {
        question: "How do I troubleshoot common RRULE syntax errors?",
        answer:
          "The most common errors are: missing FREQ property (required first), invalid BYDAY values (must use MO/TU/WE/TH/FR/SA/SU), conflicting UNTIL and COUNT (use one or neither), and BYMONTHDAY values outside the 1-31 or -31 to -1 range. The generator validates your input in real time and highlights errors before generating the string."
      },
      {
        question: "What are some RRULE strings for common scheduling scenarios?",
        answer:
          "Every business day: FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR. Every two weeks on Friday: FREQ=WEEKLY;INTERVAL=2;BYDAY=FR. Monthly on the 1st: FREQ=MONTHLY;BYMONTHDAY=1. Quarterly (every 3 months): FREQ=MONTHLY;INTERVAL=3. Annually on a fixed date: FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=15."
      }
    ],
    internalLinksText:
      "To calculate days between recurring event occurrences, use the Days Between Dates Calculator. To calculate business days for scheduling recurring tasks, try the Business Days Calculator. To generate sprint dates from a recurring sprint schedule, see the Agile Sprint Date Calculator.",
    relatedToolSlugs: [
      "days-between-dates",
      "business-days-calculator",
      "agile-sprint-date-calculator"
    ]
  }
};
