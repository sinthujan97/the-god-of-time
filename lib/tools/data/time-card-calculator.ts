import { ToolPageData } from "../toolPageData";

export const timeCardCalculatorData: ToolPageData = {
  slug: "time-card-calculator",
  name: "Time Card Calculator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Calculate daily and weekly hours worked, including overtime and breaks, from clock-in/out times.",
  
  seo: {
    title: "Time Card Calculator | Calculate Weekly Work Hours",
    metaDescription: "Calculate weekly and daily work hours with our free Time Card Calculator. Easily track clock-in/out times, deduct breaks, and compute overtime pay.",
    introText: "The Time Card Calculator simplifies tracking work hours for employees, freelancers, and managers. Enter clock-in and clock-out times for each day of the week, specify unpaid break durations, and set overtime thresholds to instantly determine total hours, regular hours, and overtime hours worked. Streamline your weekly payroll processing with accurate, real-time calculations.",
    howToTitle: "How to Use the Time Card Calculator",
    howToSteps: [
      "Select the days of the week you want to track and enter your start (clock-in) and end (clock-out) times for each day.",
      "Enter any unpaid break minutes taken during the shift to deduct them from the total hours.",
      "Specify daily and weekly overtime thresholds (such as 8 hours/day and 40 hours/week) to calculate regular vs. overtime splits.",
      "Review the instant summary showing total decimal hours, breakdown by day, and regular/overtime hours."
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
    internalLinksText: "If you need to calculate shift differentials or track hourly pay rates with different premiums, try our Shift Differential Pay Tool. If you need to plan upcoming payroll cycles, check out our Payroll Period Planner.",
    relatedToolSlugs: [
      "time-card-with-breaks",
      "overtime-pay-calculator",
      "payroll-period-planner"
    ],
    faqs: [
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
