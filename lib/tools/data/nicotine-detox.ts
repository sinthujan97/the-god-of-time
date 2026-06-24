import { ToolPageData } from "../toolPageData";

export const nicotineDetoxData: ToolPageData = {
  slug: "nicotine-detox",
  name: "Nicotine Detox Health Timeline",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#E87C7C",
  description: "Track cellular, vascular, and physiological recovery stages starting from the first hour of quitting smoking or vaping.",
  
  seo: {
    title: "Nicotine Detox Timeline | Stop Smoking Cellular Recovery Counter",
    metaDescription: "Monitor real-time physiological tissue renewal markers and cardiovascular recovery data logs after quitting smoking.",
    introText: "The Nicotine Detox Health Timeline calculates the biological milestones achieved since your last nicotine use. By entering your stop date and time, the tracker charts cardiovascular restoration, oxygen recovery, and cell renewal checkpoints.",
    howToTitle: "How to Track Recovery",
    howToSteps: [
      "Enter the exact date and time you stopped nicotine use.",
      "View the running count of hours and days since cessation.",
      "Browse the recovery checklist to see which cellular milestones are achieved.",
      "Check progress percentages for ongoing physiological adjustments."
    ],
    useCases: [
      {
        title: "Quitting Support Motivation",
        content: "Watch your biological recovery indicators tick up in real time to reinforce your commitment to quit."
      },
      {
        title: "Lung and Vascular Restoration",
        content: "Track oxygen calibration milestones to time the return of intense cardio training programs."
      },
      {
        title: "Medical Diagnostic Preparation",
        content: "Monitor nicotine clearance schedules before undergoing surgery or clinical health screenings."
      }
    ],
    internalLinksText: "To estimate BAC metrics, try the Alcohol Metabolism Clearance Clock. To map healthy habits, use the Habit Streak Milestone Planner.",
    relatedToolSlugs: [
      "alcohol-clearance",
      "habit-streak-planner",
      "sleep-calculator"
    ],
    faqs: [
      {
        question: "How quickly does the body recover after quitting?",
        answer: "Vascular improvements begin in as little as 20 minutes as heart rate stabilizes. Carbon monoxide levels in the blood drop to normal within 12 hours."
      },
      {
        question: "How long does nicotine remain in the body?",
        answer: "Nicotine clears from the bloodstream within 48 to 72 hours, which often corresponds to the peak phase of physical withdrawal symptoms."
      },
      {
        question: "Does the timeline apply to vaping?",
        answer: "Yes, the cardiovascular and nicotine clearance milestones apply similarly to both cigarette smoking and electronic vaping devices."
      }
    ]
  }
};
