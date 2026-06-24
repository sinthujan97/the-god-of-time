import { ToolPageData } from "../toolPageData";

export const timeDurationCalculatorData: ToolPageData = {
  slug: "time-duration-calculator",
  name: "Time Duration Calculator",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Calculate the exact hours, minutes, and seconds between any two times of day.",
  
  seo: {
    title: "Time Duration Calculator | Hours and Minutes Between Times",
    metaDescription: "Calculate exact hours and minutes between two times instantly. Get decimal hours for payroll, total minutes for logs, and overnight duration support.",
    introText: "The Time Duration Calculator gives you the precise number of hours, minutes, and seconds between any two times of day. Enter a start and end time to instantly see the total duration in hours and minutes, total minutes elapsed, and the decimal hour format used by payroll systems and time tracking software. Overnight durations that cross midnight are handled automatically.",
    howToTitle: "How to Calculate Hours Between Two Times",
    howToSteps: [
      "Enter your start time using the time input field. Switch to 12-hour format using the toggle if you prefer AM/PM notation over 24-hour time.",
      "Enter your end time. If your end time is earlier than your start time — for example a night shift from 10:00 PM to 6:00 AM — the calculator automatically detects the overnight crossing and returns the correct 8-hour duration.",
      "Read your result. The primary display shows total hours. The breakdown gives the same duration in hours and minutes, total minutes, and decimal hours for payroll and invoicing use."
    ],
    useCases: [
      {
        title: "For Payroll and Timesheet Logging",
        content: "Payroll systems require hours in decimal format — 7 hours and 30 minutes is 7.5 decimal hours, not 7:30. This calculator outputs both formats simultaneously so you can log the human-readable version and copy the decimal figure directly into payroll software."
      },
      {
        title: "For Freelance Invoice Time Tracking",
        content: "Freelancers billing by the hour need accurate time logs between task start and end times. Track each work block duration and use the decimal hours output to multiply directly by your hourly rate without conversion."
      },
      {
        title: "For Overnight Shift Workers",
        content: "Shift workers crossing midnight face a common calculation problem — end time appears earlier than start time. This calculator automatically identifies overnight durations and returns the correct hours worked regardless of whether the shift crosses midnight."
      },
      {
        title: "For Video and Audio Production",
        content: "Editors tracking segment durations, podcast producers calculating episode lengths, and broadcast schedulers timing program blocks all need precise time difference calculations. Toggle Include Seconds for sub-minute precision."
      }
    ],
    internalLinksText: "To convert the decimal hours output into payroll-ready format, use the Decimal Time Converter. For tracking total hours worked across multiple shifts, the Working Hours Tracker handles multi-segment logging. To add or subtract specific time durations, use the Add/Subtract Time Calculator.",
    relatedToolSlugs: [
      "decimal-time-converter",
      "working-hours-tracker",
      "add-subtract-time"
    ],
    faqs: [
      {
        question: "How does the calculator handle overnight time durations?",
        answer: "If your end time is earlier than your start time, the calculator automatically adds 24 hours to the difference to account for the midnight crossing. A shift from 10:00 PM to 6:00 AM correctly returns 8 hours, not a negative value."
      },
      {
        question: "What is decimal time and why do I need it?",
        answer: "Decimal time expresses duration as a decimal fraction of an hour. 1 hour 30 minutes is 1.5 decimal hours. Payroll systems, invoicing software, and spreadsheet formulas require this format to multiply hours by rates."
      },
      {
        question: "Can I calculate time duration in seconds?",
        answer: "Yes. Toggle Precision to Include Seconds before entering your times and the breakdown shows the full hours, minutes, and seconds breakdown alongside total seconds elapsed."
      },
      {
        question: "Does this work for durations longer than 24 hours?",
        answer: "This tool calculates within a single day cycle maximum of 24 hours. For multi-day durations combine it with the Days Between Dates Calculator to get the full day count, then use this tool for the remaining hours."
      },
      {
        question: "What is the difference between 24-hour and 12-hour format?",
        answer: "24-hour format runs from 00:00 to 23:59 with no AM or PM. 12-hour format runs from 12:00 AM to 11:59 PM. Both modes calculate identical durations — the format toggle only changes how you enter the times, not the calculation logic."
      }
    ]
  }
};
