import { ToolPageData } from "../toolPageData";

export const screenBreakTimerData: ToolPageData = {
  slug: "screen-break-timer",
  name: "Screen Time Break Timer",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#B2D828",
  description: "Configure screen breaks based on the 20-20-20 rule to prevent digital eye strain.",
  
  seo: {
    title: "Screen Time Break Timer | Ocular Fatigue Prevention Pomodoro Clocks",
    metaDescription: "Configure a professional workplace focus pacing schedule designed to prevent optical accommodation fatigue over extended screen hours.",
    introText: "The Screen Time Break Timer structures screen breaks to prevent computer vision syndrome. By inputting daily workstation hours, it projects recommended intervals, eye strain reduction percentages, and contains an active focus timer.",
    howToTitle: "How to Configure Break Timers",
    howToSteps: [
      "Select your daily digital screen hours using the input slider.",
      "Review the recommended break intervals and eye strain reduction estimates.",
      "Start the focus session timer to run in the background.",
      "Follow the 20-20-20 alert prompts when the focus block finishes."
    ],
    useCases: [
      {
        title: "Workstation Ergonomics",
        content: "Prevent eye fatigue, dryness, and headaches during extended coding or design sessions."
      },
      {
        title: "Child Screen Limitations",
        content: "Schedule structured breaks for kids during online learning or gaming sessions."
      },
      {
        title: "Desk Stretches Sync",
        content: "Coordinate eye breaks with physical posture checks and desk stretches."
      }
    ],
    internalLinksText: "To plan habit pathways, check the Habit Streak Milestone Planner. To schedule medications, try the Medication Interval Scheduler.",
    relatedToolSlugs: [
      "habit-streak-planner",
      "medication-scheduler",
      "sleep-calculator"
    ],
    faqs: [
      {
        question: "What is the 20-20-20 rule?",
        answer: "Every 20 minutes, look at an object at least 20 feet away for at least 20 seconds. This allows your ciliary muscles to relax, reducing strain."
      },
      {
        question: "How does screen time cause dry eyes?",
        answer: "Blink rates decrease by up to 50% when looking at screens, accelerating tear evaporation. Breaks help restore normal blinking patterns."
      },
      {
        question: "Can blue light filters replace eye breaks?",
        answer: "No. Filters reduce high-energy visible light, but muscles still fatigue from holding focal distance. Physical breaks are required."
      }
    ]
  }
};
