import { ToolPageData } from "../toolPageData";

export const dateMidpointCalculatorData: ToolPageData = {
  slug: "date-midpoint-calculator",
  name: "Date Midpoint Calculator",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Find the exact midpoint date and time between two custom endpoints.",
  
  seo: {
    title: "Date Midpoint Calculator | Halfway Date Finder",
    metaDescription: "Find the exact halfway date between two dates. Get the exact midpoint date, day of week, and days offset from start and end endpoints.",
    introText: "The Date Midpoint Calculator determines the exact halfway point between any two dates. Whether you are splitting a vacation, coordinating co-parenting schedules, finding the midpoint of a project timeline, or aligning milestones, this tool calculates the middle date down to the day.",
    howToTitle: "How to Find the Midpoint Date",
    howToSteps: [
      "Select your start date using the first date picker.",
      "Select your end date using the second date picker.",
      "Read the midpoint date revealed below, along with the day of the week and the number of days from the start and end dates."
    ],
    useCases: [
      {
        title: "For Shared Project Responsibilities",
        content: "If a project runs from January 1st to June 30th, find the exact midpoint to host mid-term reviews or transition milestones between teams."
      },
      {
        title: "For Co-parenting and Custody Handbacks",
        content: "Split holidays or summer vacations equally between households by calculating the exact halfway date between travel dates."
      },
      {
        title: "For Financial Interest Accrual Periods",
        content: "Locate midpoint periods for amortization schedules, bonds, or fiscal years to align reports and evaluations."
      }
    ],
    internalLinksText: "To count total calendar days between two dates, use the Days Between Dates Calculator. For finding working days, use the Business Days Calculator.",
    relatedToolSlugs: [
      "days-between-dates",
      "business-days-calculator",
      "add-days-to-date"
    ],
    faqs: [
      {
        question: "How is the date midpoint calculated?",
        answer: "The tool converts both dates to milliseconds, calculates the mathematical average of the two numbers, and converts the resulting value back into a calendar date."
      },
      {
        question: "What happens if there is an odd number of days between the dates?",
        answer: "If the difference between dates results in a half-day offset (e.g. 15 days, where the middle is 7.5 days), the calculator accounts for the millisecond average, yielding the middle date."
      },
      {
        question: "Can I input dates in reverse order?",
        answer: "Yes. The calculator accepts start and end dates in any order and will identify the correct midpoint between them."
      }
    ]
  }
};
