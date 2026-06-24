import { ToolPageData } from "../toolPageData";

export const fastingPlannerData: ToolPageData = {
  slug: "fasting-planner",
  name: "Intermittent Fasting Schedule Planner",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#E87C7C",
  description: "Plan and track daily fasting intervals (e.g., 16:8, 18:6, or custom routines) with autophagy activation markers.",
  
  seo: {
    title: "Intermittent Fasting Schedule Planner | Metabolic Fasting Hour Matrix",
    metaDescription: "Generate clean daily fasting and eating window tracking intervals based on popular metabolic wellness protocols.",
    introText: "The Intermittent Fasting Schedule Planner structures fasting and eating patterns. By inputting the time of your first meal and selecting standard metabolic protocols, the tool outputs a daily schedule timeline with autophagy start markers.",
    howToTitle: "How to Plan Fasting Schedules",
    howToSteps: [
      "Select your fasting protocol (e.g. 16:8, 18:6, 20:4, or 12:12).",
      "Enter the time of day you consume your first meal.",
      "Review the visual ring timeline detailing eating and fasting windows.",
      "Check the estimated hours required to activate autophagy."
    ],
    useCases: [
      {
        title: "Metabolic Flexibility & Weight Loss",
        content: "Track daily schedules to support insulin management, metabolic rate adjustments, and fat adaptation."
      },
      {
        title: "Cellular Renewal & Autophagy Tracking",
        content: "Identify when your body enters active cellular cleanup phases during extended fasts."
      },
      {
        title: "Cognitive Performance Focus",
        content: "Schedule fasting windows during high-focus work hours to increase mental clarity and focus."
      }
    ],
    internalLinksText: "To graph caffeine clearances, use the Caffeine Half Life Calculator. To sync sleep cycles, check the Circadian Rhythm Sleep Calculator.",
    relatedToolSlugs: [
      "caffeine-half-life",
      "sleep-calculator",
      "habit-streak-planner"
    ],
    faqs: [
      {
        question: "What is the 16:8 fasting protocol?",
        answer: "It is a popular schedule where you fast for 16 consecutive hours and consume all daily meals within an 8-hour eating window."
      },
      {
        question: "What is autophagy and when does it start?",
        answer: "Autophagy is the body's process of clearing out damaged cells. It typically begins after 12 to 18 hours of continuous fasting."
      },
      {
        question: "Can I drink water during fasting windows?",
        answer: "Yes. Non-caloric beverages like water, black coffee, and plain green tea are allowed and do not break your fast."
      }
    ]
  }
};
