import { ToolPageData } from "../toolPageData";

export const sleepCalculatorData: ToolPageData = {
  slug: "sleep-calculator",
  name: "Circadian Rhythm Sleep Calculator",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#E87C7C",
  description: "Calculate optimal times to sleep or wake up based on natural 90-minute sleep cycles.",
  
  seo: {
    title: "Circadian Rhythm Sleep Calculator | Sleep Wake Cycle REM Optimizers",
    metaDescription: "Optimize your sleep schedule using natural 90-minute REM cycle calculations. Prevent morning grogginess by syncing wake times perfectly.",
    introText: "The Circadian Rhythm Sleep Calculator helps you design sleep routines by aligning them with natural brainwave patterns. By scheduling sleep in 90-minute increments, you can wake up at the end of a sleep cycle, preventing morning grogginess.",
    howToTitle: "How to Calculate Sleep Cycles",
    howToSteps: [
      "Select your calculation direction: 'Wake Up At' or 'Go to Bed At'.",
      "Enter your target time using the time picker.",
      "Review the suggested sleep and wake windows.",
      "Choose a window highlighted as optimal (representing 5 or 6 complete REM cycles)."
    ],
    useCases: [
      {
        title: "Preventing Morning Grogginess",
        content: "Avoid waking up in the middle of deep REM sleep by planning sleep durations in 1.5-hour increments."
      },
      {
        title: "Shift Work Schedule Design",
        content: "Plan sleep shifts when transitioning to night rosters to keep sleep quality high."
      },
      {
        title: "Jet Lag Recovery",
        content: "Reset your circadian rhythm by planning sleep cycles that align with your destination timezone."
      }
    ],
    internalLinksText: "To plan adjustments for rotating rosters, check the Shift Work Sleep Adjuster. To prevent digital eye fatigue before sleep, use the Screen Time Break Timer.",
    relatedToolSlugs: [
      "shift-sleep-adjuster",
      "screen-break-timer",
      "habit-streak-planner"
    ],
    faqs: [
      {
        question: "How long is a standard sleep cycle?",
        answer: "A complete sleep cycle (progressing through light sleep, deep sleep, and REM sleep) takes approximately 90 minutes on average."
      },
      {
        question: "What is the fall asleep buffer?",
        answer: "Most people take about 14 minutes to fall asleep after laying down. The calculator adds this buffer to its recommendations to keep timings accurate."
      },
      {
        question: "How many sleep cycles do I need per night?",
        answer: "Sleeping for 5 cycles (7.5 hours) or 6 cycles (9 hours) is optimal for most adults to support cognitive recovery."
      }
    ]
  }
};
