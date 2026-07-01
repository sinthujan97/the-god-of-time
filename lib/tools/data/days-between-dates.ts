import { ToolPageData } from "../toolPageData";

export const daysBetweenDatesData: ToolPageData = {
  slug: "days-between-dates",
  name: "Days Between Dates Calculator",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#C5F135",
  description: "Calculate the exact number of days, weeks, and months between any two dates instantly.",
  
  seo: {
    title: "Days Between Dates Calculator | Count Calendar Days",
    
    metaDescription: "Calculate the exact days between dates with our free calendar counter. Count total days, weeks, or months between any two dates instantly.",
    
    introText: "The Days Between Dates Calculator gives you the exact number of calendar days separating any two points in time. Whether you are tracking a project deadline, calculating a legal notice period, or satisfying simple curiosity, this free date duration tool delivers instant results — down to the day. Enter your start and end dates above to see total days, full weeks, and complete calendar months all at once.",

    howToTitle: "How to Calculate Days Between Two Dates",
    
    howToSteps: [
      "Select your start date using the date picker above — this is the first day of your period. The calculator defaults to today so you can begin counting forward immediately.",
      "Select your end date — the final day of the period you want to measure. The calculator accepts any date from the year 1000 to 9999.",
      "Read your result instantly. The primary number shows total calendar days. The breakdown below it shows the same duration expressed in weeks and months. Toggle Business Days Only to strip out Saturdays and Sundays from the count."
    ],

    useCases: [
      {
        title: "For Project Management Deadlines",
        content: "Project managers use date duration calculations to determine realistic timelines between kickoff and delivery. Knowing there are 47 calendar days or 33 business days between two milestones gives your team a concrete frame to plan sprints, allocate resources, and set client expectations without ambiguity."
      },
      {
        title: "For Legal Notice Tracking",
        content: "Many legal instruments — lease termination notices, contract cancellation periods, statutory filing windows — specify exact calendar day requirements. A 30-day notice period that begins October 3rd ends November 2nd, not November 1st. Use the Include End Date toggle to count inclusively when your legal document requires it."
      },
      {
        title: "For Financial and Loan Calculations",
        content: "Interest accrual, loan maturity periods, and payment due date tracking all depend on precise day counts. Banks and financial institutions use exact calendar day arithmetic — not 30-day month approximations — to calculate interest. This tool uses the same real-calendar logic."
      },
      {
        title: "For Personal Milestone Tracking",
        content: "How many days until your wedding? How long have you been at your job? How many days since a loved one passed? Personal milestones deserve precise answers. Enter any two dates — past, present, or future — and get the exact count with weeks and months broken out below."
      }
    ],

    internalLinksText: "If you need to find a specific future or past date rather than count between two known dates, use the Add Days to Date tool or the Subtract Days from Date tool. For tracking working timelines specifically, the Business Days Calculator excludes weekends automatically.",

    relatedToolSlugs: [
      "add-days-to-date",
      "subtract-days-from-date", 
      "business-days-calculator"
    ],

    faqs: [
      {
        question: "Does this calculator include leap years automatically?",
        answer: "Yes. The calculation engine accounts for every historical and future leap year automatically. If your date range crosses a February 29th, that day is included in the count and flagged in the breakdown below the result."
      },
      {
        question: "How do I calculate days between dates excluding weekends?",
        answer: "Toggle the Count Mode option to Business Days Only before or after entering your dates. The result updates instantly to show only Monday through Friday days within your selected range, with the number of excluded weekend days shown in the breakdown."
      },
      {
        question: "Does the calculator include or exclude the end date?",
        answer: "By default the end date is not included — the count measures the gap between the two dates. Toggle End Date to Included if your use case requires counting the end date itself, such as legal notice periods that run through the final day."
      },
      {
        question: "What is the difference between calendar days and business days?",
        answer: "Calendar days count every day including weekends and public holidays. Business days count only Monday through Friday. A 10-calendar-day period starting Monday contains 8 business days. Use calendar days for general duration and business days for workplace or contractual timelines."
      },
      {
        question: "Can I share a link with my dates pre-filled?",
        answer: "Yes. Click the Share button after calculating and a URL with your dates embedded as parameters is copied to your clipboard. Anyone who opens that link sees the same dates pre-filled and the result calculated automatically."
      }
    ]
  }
};
