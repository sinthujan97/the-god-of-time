import { ToolPageData } from "../toolPageData";

export const caffeineHalfLifeData: ToolPageData = {
  slug: "caffeine-half-life",
  name: "Caffeine Elimination Curve Tool",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#E87C7C",
  description: "Graph the decline of caffeine levels in your body based on typical half-life models to protect sleep quality.",
  
  seo: {
    title: "Caffeine Half Life Calculator | Metabolic Stimulant Clearance Tracking",
    metaDescription: "Plot the biological metabolic clearance timeline of caffeine down to your target bedtime hours to protect deep sleep architectures.",
    introText: "The Caffeine Elimination Curve Tool measures the rate at which your liver clears caffeine. By inputting beverage types, consumption times, and target bedtimes, it calculates remaining stimulant levels and sleep disruption risk metrics.",
    howToTitle: "How to Track Caffeine Clearance",
    howToSteps: [
      "Select your beverage type (Espresso, Coffee, Energy Drink, or Tea).",
      "Enter the local time of day you consumed the drink.",
      "Input your target bedtime hour to evaluate remaining mg.",
      "Review the hourly decay curve and corresponding sleep disruption risk score."
    ],
    useCases: [
      {
        title: "Deep Sleep Optimization",
        content: "Identify when to stop caffeine intake in the afternoon to ensure bedtime levels are low enough for healthy slow-wave sleep."
      },
      {
        title: "Workday Energy Spacing",
        content: "Space out coffee intakes to prevent overlapping stimulant spikes that trigger jitters and crash cycles."
      },
      {
        title: "Athletic Performance Timing",
        content: "Time pre-workout caffeine consumption to hit peak plasma levels during athletic training sessions."
      }
    ],
    internalLinksText: "To plan fasting hours, use the Intermittent Fasting Schedule Planner. To check sleep cycle nodes, check the Circadian Rhythm Sleep Calculator.",
    relatedToolSlugs: [
      "fasting-planner",
      "sleep-calculator",
      "habit-streak-planner"
    ],
    faqs: [
      {
        question: "What is the average half-life of caffeine?",
        answer: "For most healthy adults, caffeine's half-life ranges from 5 to 6 hours, meaning half the stimulant remains in your bloodstream after that time."
      },
      {
        question: "How much caffeine can remain at bedtime without disrupting sleep?",
        answer: "Ideally, you should aim for less than 50mg of caffeine in your system at bedtime. Levels above this can prevent entering deep sleep phases."
      },
      {
        question: "Does nicotine affect caffeine clearance?",
        answer: "Yes, smoking or nicotine use speeds up caffeine metabolism, cutting its half-life in half, while pregnancy and oral contraceptives can double it."
      }
    ]
  }
};
