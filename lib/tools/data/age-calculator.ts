import { ToolPageData } from "../toolPageData";

export const ageCalculatorData: ToolPageData = {
  slug: "age-calculator",
  name: "Age Calculator (Down to the Second)",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#B2D828",
  description: "Calculate your exact age down to the second, minute, and day, tracking your total days alive.",
  
  seo: {
    title: "Exact Age Calculator | Chronological Longevity Metrics Milliseconds",
    metaDescription: "Calculate your exact age down to the second, minute, and day. Discover your total days alive and next birthday countdown metrics.",
    introText: "The Age Calculator provides a high-resolution view of your chronological lifespan. By syncing live ticking loops with your birth date and birth time, it records the passing seconds, days alive, and time remaining until your next milestone birthday.",
    howToTitle: "How to Measure Your Exact Age",
    howToSteps: [
      "Select your date of birth using the calendar picker.",
      "Input the exact time of birth (HH:MM) to align seconds calculations.",
      "Observe the ticking odometer count up years, months, weeks, days, hours, and seconds.",
      "Review the remaining days and hours until your next birthday."
    ],
    useCases: [
      {
        title: "Life Milestone Auditing",
        content: "Track exactly when you cross interesting milestones, such as being alive for exactly 10,000 or 15,000 days."
      },
      {
        title: "Astro and Bio Chronology",
        content: "Calculate highly accurate age inputs for scientific biological studies or physiological charts."
      },
      {
        title: "Aviation and Licensing Audits",
        content: "Determine exact age verification targets for regulatory permits that enforce age limits."
      }
    ],
    internalLinksText: "To translate animal lifecycles, check the Pet Age Translator. To set pediatric health schedules, use the Vaccination Tracker Timeline.",
    relatedToolSlugs: [
      "pet-age-translator",
      "vaccination-tracker",
      "pregnancy-due-date"
    ],
    faqs: [
      {
        question: "Does the calculator account for leap years?",
        answer: "Yes. The underlying math calculates differences between Date instances, automatically accounting for leap years and daylight saving changes."
      },
      {
        question: "Why does the age tick up in real time?",
        answer: "A client-side react hook runs every 1000 milliseconds to tick the clock forward, mirroring the flow of time."
      },
      {
        question: "How is total days alive calculated?",
        answer: "It divides the absolute millisecond delta between your birth date and the current moment by 86,400,000, rounding down to the nearest whole day."
      }
    ]
  }
};
