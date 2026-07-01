import { ToolPageData } from "../toolPageData";

export const trimesterCalendarData: ToolPageData = {
  slug: "trimester-calendar",
  name: "Trimester Milestone Calendar",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#B2D828",
  description: "Map out the exact start and end dates for your pregnancy trimesters based on your clinical due date.",
  
  seo: {
    title: "Pregnancy Trimester Calendar | Weekly Gestational Development Tracking",
    metaDescription: "Map out the exact start and end dates for your pregnancy trimesters based on your clinical due date.",
    introText: "The Trimester Milestone Calendar divides the 40-week gestation timeline into three distinct developmental chapters. Understanding when you pass each trimester threshold helps you align health plans, physical shifts, and maternal checklists.",
    howToTitle: "How to Calculate Trimesters",
    howToSteps: [
      "Select your estimated due date using the calendar picker.",
      "View the calculated countdown of remaining days until your target due date.",
      "Review the three trimester panels listing start dates, end dates, and developmental markers.",
      "Identify your current trimester highlighted in your active dashboard."
    ],
    useCases: [
      {
        title: "Medical Checkup Tracking",
        content: "Track which trimester you are in to anticipate diagnostic screenings, glucose tests, or anatomical scans."
      },
      {
        title: "Symptom Phase Management",
        content: "Understand when early pregnancy morning sickness usually subsides (transitioning to Trimester 2) and third-trimester fatigue begins."
      },
      {
        title: "Diet & Fitness Planning",
        content: "Adjust daily calorie counts and exercise routines according to the specific recommendations of each trimester."
      }
    ],
    internalLinksText: "To calculate your due date from scratch, use the Pregnancy Due Date Calculator. To track pediatric schedules, check the Vaccination Tracker Timeline.",
    relatedToolSlugs: [
      "pregnancy-due-date",
      "vaccination-tracker",
      "ovulation-calculator"
    ],
    faqs: [
      {
        question: "When does the second trimester officially start?",
        answer: "Obstetric standards define the second trimester as beginning on the first day of week 14 (13 weeks + 1 day elapsed from LMP)."
      },
      {
        question: "Why do some sources list different trimester weeks?",
        answer: "Pregnancy divides into 40 weeks. Dividing 40 by 3 creates fractional weeks. Standard clinical rules split them at weeks 1-13 (T1), 14-27 (T2), and 28+ (T3)."
      },
      {
        question: "How does the countdown days metric help?",
        answer: "It measures absolute days between today and the calculated due date, providing a clear preparation timeline."
      }
    ]
  }
};
