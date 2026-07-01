import { ToolPageData } from "../toolPageData";

export const habitStreakPlannerData: ToolPageData = {
  slug: "habit-streak-planner",
  name: "Habit Streak Milestone Planner",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#B2D828",
  description: "Chart timeline targets (e.g., 21 days, 66 days, 100 days) to form solid routines based on psychological neuroscience.",
  
  seo: {
    title: "Habit Streak Milestone Planner | Behavioral Automation Focus Calendars",
    metaDescription: "Track the exact future calendar dates required to automate new behavioral habits based on psychological neuroscience parameters.",
    introText: "The Habit Streak Milestone Planner calculates key milestones in the habit formation process. Drawing from neuroscience and behavioral research, it maps out your progression from early adjustment (Day 21) to neurological automation (Day 66) and full integration (Day 100).",
    howToTitle: "How to Plan Habit Milestones",
    howToSteps: [
      "Select your habit initiation date using the datepicker.",
      "Review the milestone pathway showing calculated calendar targets.",
      "Check the days elapsed since you began your habit streak.",
      "Track your progress through each psychological phase."
    ],
    useCases: [
      {
        title: "Fitness Habit Consistency",
        content: "Set a start date for a new exercise routine and identify key calendar markers to push through cognitive friction phases."
      },
      {
        title: "Studying or Skill Acquisition",
        content: "Track professional certification goals by monitoring the 66-day neurological integration milestone."
      },
      {
        title: "Mindfulness and Meditation Blocks",
        content: "Establish daily meditation streaks, understanding the calendar date when active behavior becomes natural routine."
      }
    ],
    internalLinksText: "To plan fasting routines, check the Intermittent Fasting Schedule Planner. To optimize sleep wake cycles, use the Circadian Rhythm Sleep Calculator.",
    relatedToolSlugs: [
      "fasting-planner",
      "sleep-calculator",
      "screen-break-timer"
    ],
    faqs: [
      {
        question: "Does it really take 21 days to form a habit?",
        answer: "The 21-day rule is a historical myth. Modern neuroscience research (like the Lally study) shows that true neurological automation takes an average of 66 days, depending on complexity."
      },
      {
        question: "What is the Neurological Automation Phase?",
        answer: "This is the point where the brain builds solid synaptic pathways for a behavior, reducing the willpower required to perform it."
      },
      {
        question: "What happens if I miss a single day?",
        answer: "Missed days are normal. Studies show that missing a single day does not derail long-term habit formation, provided you resume consistency immediately."
      }
    ]
  }
};
