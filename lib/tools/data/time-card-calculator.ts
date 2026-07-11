import { ToolPageData } from "../toolPageData";

export const timeCardCalculatorData: ToolPageData = {
  slug: "time-card-calculator",
  name: "Time Card Calculator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Calculate daily and weekly hours worked, including overtime and breaks, from clock-in/out times.",
  
  seo: {
    title: "Time Card Calculator | Free With Lunch & Overtime",
    metaDescription: "Free time card calculator. Enter start, end, and break times for each day and see total hours, overtime, and gross pay. No signup required.",
    introText: "This time card calculator lets you enter your clock-in, clock-out, and break times for each working day and instantly returns total hours, regular hours, overtime, and gross pay if you provide your hourly rate. People search for a time card calculator with lunch built in, a time card calculator hours and minutes tool, or a general time clock calculator or timesheet calculator, and this covers all of it in one place. Hourly employees verifying their paycheck, managers approving timesheets, freelancers tracking billable hours, and anyone paid by the hour use it the same way. The lunch and break deduction is handled properly here — enter your actual unpaid break time per day and it's subtracted automatically, which is where most competing calculators handle things poorly.",
    howToTitle: "How to Calculate Your Time Card",
    howToSteps: [
      "Enter your clock-in and clock-out time for each day of the week.",
      "Enter any unpaid break time (lunch, other breaks) for each day.",
      "The calculator totals your hours, separates regular from overtime, and shows gross pay if you enter your hourly rate.",
      "For reference, the manual formula is: Hours worked = (Clock-out − Clock-in) − Breaks. Overtime = any hours beyond 40 in the week. Overtime pay = overtime hours × (hourly rate × 1.5)."
    ],
    sections: [
      {
        title: "Time Card Rules — Breaks, Overtime, and Rounding",
        body: "Under federal break rules (FLSA), rest breaks of 20 minutes or less must be paid. Meal breaks of 30 or more minutes can be unpaid only if the employee is fully relieved of duties — employees who work through lunch must be paid for that time. Federal overtime rules (FLSA) apply overtime to all hours over 40 in a 7-day workweek at 1.5× the regular rate, and this threshold is weekly, not daily, in most states. Some states are the exception: California, Alaska, Nevada, and a few others require daily overtime for hours worked beyond 8 in a single day, so it's worth checking your state's specific rules rather than assuming the federal weekly threshold applies. Time rounding rules allow employers to round time to the nearest 5 or 15 minutes, but only if the rounding doesn't consistently disadvantage employees — this calculator shows exact minutes by default rather than rounding for you."
      }
    ],
    useCases: [
      {
        title: "For Hourly Employees",
        content: "Track your daily shift durations, ensure your unpaid breaks are correctly subtracted, and keep a personal record of regular and overtime hours to match against your paycheck."
      },
      {
        title: "For Small Business Payroll",
        content: "Simplify payroll processing by entering employee timesheet logs and getting total hours for the pay period, preventing manual calculations and errors."
      },
      {
        title: "For Freelancers and Contractors",
        content: "Calculate exactly how many billable hours you worked during the week to prepare detailed, accurate invoices for your clients."
      }
    ],
    internalLinksText: "Calculate your overtime earnings in detail with the Overtime Pay Calculator, total hours across a two-week pay period with the Biweekly Timesheet Calculator, or convert your hourly rate to annual salary with the Hourly to Salary Converter.",
    relatedToolSlugs: [
      "overtime-pay-calculator",
      "free-biweekly-timesheet-calculator",
      "hourly-to-salary"
    ],
    faqs: [
      {
        question: "How do I calculate my time card?",
        answer: "Enter your clock-in and clock-out times for each day, subtract any unpaid break time (typically the lunch break), and total the hours for the week. Any hours beyond 40 are overtime. The calculator does all of this automatically — enter your times and it shows regular hours, overtime hours, and gross pay if you provide your rate."
      },
      {
        question: "What is a time card calculator used for?",
        answer: "A time card calculator converts raw clock-in and clock-out times into total hours worked, breaks down regular versus overtime hours, and calculates gross pay. It is used by hourly employees to verify their paycheck before it is processed, by managers to approve employee timesheets, and by freelancers to total their weekly billable hours."
      },
      {
        question: "How does a time card calculator work?",
        answer: "The calculator subtracts your clock-in time from your clock-out time for each day, then subtracts any unpaid break time to get net hours per day. It totals all days for the week and applies your jurisdiction's overtime threshold (default 40 hours/week) to identify any overtime hours. Gross pay is calculated as (regular hours × regular rate) + (overtime hours × 1.5 × regular rate)."
      },
      {
        question: "Can I calculate overtime with this tool?",
        answer: "Yes. Enter your hourly rate and the calculator automatically separates regular hours (up to 40) from overtime hours (above 40) and shows both the hours and the pay for each. California daily overtime mode is available in settings for workers in states with daily overtime rules."
      },
      {
        question: "What are the rules for breaks on a time card?",
        answer: "Under the FLSA, paid rest breaks of 20 minutes or less must be counted as work time. Unpaid meal breaks of 30 minutes or more can be deducted only if the employee is completely relieved of work. If an employee works through their lunch break, that time must be included in their hours worked. Enter your unpaid break duration per day and the calculator deducts it automatically."
      },
      {
        question: "How do I use the time card calculator effectively?",
        answer: "Use 24-hour time entry (e.g., 17:30 for 5:30 PM) for the most reliable input. Enter your actual break duration rather than a standard estimate — most time card disputes arise from inaccurate break deductions. Save your weekly result before the next pay period to maintain a personal record that you can compare against your pay stub."
      },
      {
        question: "Does the calculator handle overnight shifts?",
        answer: "Yes. If your clock-out time is earlier than your clock-in time (e.g., in at 10:00 PM and out at 6:00 AM), the calculator automatically assumes an overnight shift and calculates the duration correctly."
      },
      {
        question: "How are breaks subtracted from the total work hours?",
        answer: "The calculator converts break minutes into decimal hours and subtracts them directly from the gross shift duration."
      },
      {
        question: "What are the default overtime thresholds?",
        answer: "The default daily threshold is 8 hours, and the weekly threshold is 40 hours, matching standard US labor guidelines. You can adjust these values to fit your local labor laws."
      }
    ]
  }
};
