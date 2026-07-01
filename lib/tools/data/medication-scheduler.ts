import { ToolPageData } from "../toolPageData";

export const medicationSchedulerData: ToolPageData = {
  slug: "medication-scheduler",
  name: "Medication Interval Scheduler",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#B2D828",
  description: "Generate structured intake reminders based on hourly intervals and daily dosage quantities.",
  
  seo: {
    title: "Medication Interval Scheduler | Prescription Alarm Log Matrix",
    metaDescription: "Generate an automated clinical intake interval schedule for rotating prescriptions and tracking daily medication doses.",
    introText: "The Medication Interval Scheduler helps patients and caregivers coordinate complex dosing schedules. By entering the first dose time, frequency in hours, and total doses, it calculates an intake checklist with food guidelines.",
    howToTitle: "How to Schedule Dosages",
    howToSteps: [
      "Enter the time of your first daily dose.",
      "Select the frequency interval (every X hours) required by your doctor.",
      "Input the total number of doses needed for the full course.",
      "Review the structured checklist showing planned times and food requirements."
    ],
    useCases: [
      {
        title: "Antibiotic Treatment Management",
        content: "Ensure doses are spaced evenly throughout the day to maintain constant blood levels and prevent resistance."
      },
      {
        title: "Chronic Care Reminders",
        content: "Build daily schedules for rotating blood pressure, thyroid, or diabetes treatments."
      },
      {
        title: "Post-Surgery Recovery Plans",
        content: "Track pain management dosing intervals overnight without missed or doubled doses."
      }
    ],
    internalLinksText: "To log screen breaks, use the Screen Time Break Timer. To adjust sleep schedules, try the Shift Work Sleep Adjuster.",
    relatedToolSlugs: [
      "screen-break-timer",
      "shift-sleep-adjuster",
      "habit-streak-planner"
    ],
    faqs: [
      {
        question: "Why do some medications require food warnings?",
        answer: "Certain drugs are absorbed better or cause less stomach irritation when taken with meals. The scheduler flags alternating slots to support digestion."
      },
      {
        question: "What should I do if I miss a scheduled dose?",
        answer: "Consult your pharmacist or doctor. Do not double a dose to catch up unless explicitly instructed."
      },
      {
        question: "Can I print this schedule?",
        answer: "Yes, the checklist is designed to print clearly, making it easy to post on your refrigerator or medical file."
      }
    ]
  }
};
