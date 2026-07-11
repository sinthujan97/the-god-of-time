import { ToolPageData } from "../toolPageData";

export const ovulationCalculatorData: ToolPageData = {
  slug: "ovulation-calculator",
  name: "Ovulation & Fertility Window Map",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#B2D828",
  description: "Track your cycle to find estimated ovulation dates and fertile windows across an ongoing six-month period.",
  
  seo: {
    title: "Ovulation Fertility Calculator | Conception Window Calendar Maps",
    metaDescription: "Plot your fertile window and ovulation tracking dates accurately across an ongoing six-month reproductive tracking matrix.",
    introText: "The Ovulation & Fertility Window Map projects ovulation and conception dates based on cycle history. It generates a rolling 6-month calendar highlighting fertile windows, helping you optimize timing for family planning.",
    howToTitle: "How to Map Fertility Windows",
    howToSteps: [
      "Input the start date of your last menstrual period.",
      "Enter your average cycle length (typically between 22 and 45 days).",
      "Examine the calendar grid to see your peak fertile days highlighted in a soft accent color.",
      "View upcoming ovulation dates and next expected periods for the next six months."
    ],
    useCases: [
      {
        title: "Family Planning Optimization",
        content: "Identify the 5 days leading up to and including ovulation to increase conception probability."
      },
      {
        title: "Cycle Awareness Tracking",
        content: "Understand regular monthly patterns to monitor reproductive health and hormone shifts."
      },
      {
        title: "Vacation & Event Planning",
        content: "Project future period dates to schedule travel, sports events, or medical procedures without surprises."
      }
    ],
    internalLinksText: "To calculate pregnancy due dates once conceived, use the Pregnancy Due Date Calculator. To build a trimester calendar, check the Trimester Milestone Calendar.",
    relatedToolSlugs: [
      "pregnancy-due-date-calculator",
      "trimester-calendar",
      "habit-streak-planner"
    ],
    faqs: [
      {
        question: "When does ovulation typically occur?",
        answer: "In a standard 28-day cycle, ovulation occurs about 14 days before the next period starts. If your cycle is longer or shorter, this window shifts accordingly."
      },
      {
        question: "How long is a sperm's lifespan inside the body?",
        answer: "Sperm can survive in the reproductive tract for up to 5 days, which is why the fertile window begins 5 days before ovulation."
      },
      {
        question: "What cycle lengths are considered regular?",
        answer: "Most cycles range from 21 to 35 days. If your cycles vary significantly from month to month, consult a doctor for personalized monitoring."
      }
    ]
  }
};
