import { ToolPageData } from "../toolPageData";

export const shiftSleepAdjusterData: ToolPageData = {
  slug: "shift-sleep-adjuster",
  name: "Shift Work Sleep Adjuster",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#E87C7C",
  description: "Plan sleep and light exposure transitions when adapting your circadian rhythm to rotating shift work.",
  
  seo: {
    title: "Shift Work Sleep Adjuster | Circadian Rhythm Chronotype Transition Systems",
    metaDescription: "Program an automated sleep modification timeline to smoothly transit circadian rhythms between opposing work shift logs.",
    introText: "The Shift Work Sleep Adjuster generates progressive sleep shift programs. By calculating adjustments over available transition days, it provides sleep schedules and light exposure windows to mitigate roster changes.",
    howToTitle: "How to Adjust Roster Sleep",
    howToSteps: [
      "Enter your current typical wake time.",
      "Input your new target shift wake time.",
      "Set the number of available transition days.",
      "Review the daily calendar mapping sleep, wake, and light windows."
    ],
    useCases: [
      {
        title: "Night Shift Transitions",
        content: "Shift sleep schedules progressively by 1 to 2 hours daily before commencing night shift blocks to minimize fatigue."
      },
      {
        title: "Emergency Service Schedules",
        content: "Help police, fire, or nursing staff adapt to rotating day/night rosters."
      },
      {
        title: "International Business Travel",
        content: "Pre-adjust sleep times leading up to transmeridian flights to combat jet lag."
      }
    ],
    internalLinksText: "To schedule medication timers, check the Medication Interval Scheduler. To plan screen breaks, try the Screen Time Break Timer.",
    relatedToolSlugs: [
      "medication-scheduler",
      "screen-break-timer",
      "sleep-calculator"
    ],
    faqs: [
      {
        question: "How fast can the circadian rhythm adapt?",
        answer: "On average, the human circadian clock can adjust by about 1 to 1.5 hours per day. Trying to shift faster can trigger cognitive strain."
      },
      {
        question: "Why are light exposure windows important?",
        answer: "Light exposure suppresses melatonin synthesis in the pineal gland. Exposing yourself to light at the correct times anchors your new rhythm."
      },
      {
        question: "How should I manage sleep environment transitions?",
        answer: "During daytime sleep transitions, use blackout curtains, white noise machines, and keep bedroom temperatures cool."
      }
    ]
  }
};
