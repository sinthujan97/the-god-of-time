import { ToolPageData } from "../toolPageData";

export const timeCardWithBreaksData: ToolPageData = {
  slug: "time-card-with-breaks",
  name: "Multi-Break Time Card Tool",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Track work hours with multiple lunch and rest breaks, allocating paid and unpaid break times accurately.",
  
  seo: {
    title: "Multi-Break Time Card Tool | Track Shifts with Multiple Breaks",
    metaDescription: "Calculate work hours with multiple break durations. Deduct unpaid breaks while applying paid break allowances dynamically.",
    introText: "The Multi-Break Time Card Tool is designed for shifts that involve multiple breaks throughout the day. It allows you to log multiple break start and end times, compute the total break duration, and automatically apply paid break allowances to calculate your net working hours. Perfect for complex shifts, retail, manufacturing, or healthcare schedules.",
    howToTitle: "How to Calculate Hours with Multiple Breaks",
    howToSteps: [
      "Enter your shift start time (clock-in) and shift end time (clock-out).",
      "Add rows for each break, entering the start and end times for each break taken.",
      "Input your paid break allowance in minutes (the amount of break time that should remain paid).",
      "Read your gross hours, total break duration, paid break allocation, unpaid break deduction, and final net hours instantly."
    ],
    useCases: [
      {
        title: "Retail & Shift Work",
        content: "Employees who take a 30-minute unpaid lunch plus two 15-minute paid rest breaks can log all intervals to verify their total hours and paid time compliance."
      },
      {
        title: "Healthcare Shifts",
        content: "Nurses and medical staff on long 12-hour shifts often take multiple meals or rest periods. Log all break segments to get clean net work hours."
      },
      {
        title: "Employer Compliance Tracking",
        content: "Managers can verify that shift breaks align with company policy and legal guidelines, ensuring employees receive their paid break allowances."
      }
    ],
    internalLinksText: "For standard timesheet calculations with a single break, use the Time Card Calculator. To calculate total pay including overtime, try the Overtime Pay Calculator.",
    relatedToolSlugs: [
      "time-card-calculator",
      "break-deductor",
      "overtime-pay-calculator"
    ],
    faqs: [
      {
        question: "What is a paid break allowance?",
        answer: "A paid break allowance is the duration of break time (in minutes) that is paid by the employer. For example, if you take 45 minutes of total breaks and have a 30-minute paid allowance, only 15 minutes will be subtracted as unpaid break time."
      },
      {
        question: "How does the calculator handle overlapping breaks?",
        answer: "The calculator assumes breaks are sequential and do not overlap. Enter each distinct break start and end time separately for accurate results."
      },
      {
        question: "Can I enter overnight shifts here?",
        answer: "Yes, the shift start and end times support overnight transitions. If the end time is chronologically earlier than the start time, it calculates across the midnight boundary."
      }
    ]
  }
};
