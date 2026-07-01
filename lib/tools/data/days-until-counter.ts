import { ToolPageData } from "../toolPageData";

export const daysUntilCounterData: ToolPageData = {
  slug: "days-until-counter",
  name: "Days Until Counter",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#C5F135",
  description: "Count down the precise days, hours, minutes, and seconds remaining until an upcoming event or deadline.",
  
  seo: {
    title: "Days Until Calculator | Live Event Countdown",
    metaDescription: "Calculate the exact number of days until any future date. Get a live ticking countdown in days, hours, minutes, and seconds for events, launches, or deadlines.",
    introText: "The Days Until Counter calculates the exact time remaining from today to any date in the future. Ideal for tracking project launches, personal milestones, wedding dates, or exams, this tool gives you a live ticking countdown displaying days, hours, minutes, and seconds, ensuring you stay updated in real time.",
    howToTitle: "How to Calculate Days Until an Event",
    howToSteps: [
      "Select your target future date using the date picker.",
      "Watch the live countdown start ticking immediately.",
      "Read the breakdown showing total days, alongside hours, minutes, and seconds left until the date arrives."
    ],
    useCases: [
      {
        title: "For Project Launches and Deadlines",
        content: "Track major business deadlines or product release dates down to the second. A live countdown on a shared dashboard keeps remote teams aligned and motivated as the deadline approaches."
      },
      {
        title: "For Personal Milestone Planning",
        content: "Count down the days until a wedding, vacation, graduation, or retirement. Knowing the exact days left helps you organize tasks and builds excitement for the big day."
      },
      {
        title: "For Marketing Campaigns",
        content: "Keep track of when a promotion, early-bird price, or flash sale ends. The countdown format emphasizes urgency and provides exact windows for sending reminders."
      }
    ],
    internalLinksText: "To count days elapsed since a past milestone instead, use the Days Since Counter. To find the exact number of calendar days between two custom dates, use the Days Between Dates Calculator.",
    relatedToolSlugs: [
      "days-since-counter",
      "days-between-dates",
      "add-days-to-date"
    ],
    faqs: [
      {
        question: "Does the countdown update in real time?",
        answer: "Yes. The countdown ticks down live, updating every second to show the exact days, hours, minutes, and seconds remaining."
      },
      {
        question: "What happens if I select a date in the past?",
        answer: "If you select a date that has already passed, the tool automatically switches modes to act as a 'Days Since' counter, showing how much time has elapsed since that event."
      },
      {
        question: "Does it account for timezone differences?",
        answer: "Yes, the calculations are executed locally using your browser's local timezone, ensuring the countdown matches your local calendar day transitions."
      }
    ]
  }
};
