import { ToolPageData } from "../toolPageData";

export const pregnancyDueDateData: ToolPageData = {
  slug: "pregnancy-due-date",
  name: "Pregnancy Due Date Calculator",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#E87C7C",
  description: "Calculate estimated pregnancy due dates using your last menstrual period (LMP) or conception dates.",
  
  seo: {
    title: "Pregnancy Due Date Calculator | Conception Last Menstrual Period LMP Estimator",
    metaDescription: "Instantly calculate your estimated pregnancy due date and track your exact gestational week using your last period or conception date.",
    introText: "The Pregnancy Due Date Calculator uses clinical obstetric dating models to establish gestational milestone paths. By converting chronological calendar tracking variables into biological developmental intervals, this tool gives prospective parents a precise roadmap of their biological timeline.",
    howToTitle: "How to Track Due Dates",
    howToSteps: [
      "Select your calculation method: Last Menstrual Period (LMP) or Conception Date.",
      "Input the corresponding start date using the calendar picker.",
      "Adjust the average cycle length slider (defaults to 28 days).",
      "Observe the calculated estimated due date, gestational age, and progress percentage immediately."
    ],
    useCases: [
      {
        title: "Birth Planning & Nursery Prep",
        content: "Estimate your target birth week to prepare your nursery, organize maternity leaves, and hire birth support."
      },
      {
        title: "Clinical Appointment Auditing",
        content: "Crosscheck gestational weeks before scheduling prenatal checkups, blood panels, or ultrasound windows."
      },
      {
        title: "IVF & Assisted Cycle Logs",
        content: "Input specific conception or transfer dates directly to establish precise gestational age alignment."
      }
    ],
    internalLinksText: "To break your pregnancy timeline into trimesters, use the Trimester Milestone Calendar. To track vaccination targets from birth, check the Vaccination Tracker Timeline.",
    relatedToolSlugs: [
      "trimester-calendar",
      "vaccination-tracker",
      "age-calculator"
    ],
    faqs: [
      {
        question: "How accurate is Naegele's rule for due dates?",
        answer: "It provides an industry-standard 40-week baseline calculation, though actual spontaneous delivery safely varies within a two-week window surrounding the target anchor date."
      },
      {
        question: "Does cycle length alter gestational week math?",
        answer: "Yes, adjusting for longer or shorter cycles shifts the estimated ovulation window, protecting the accuracy of early tracking milestones."
      },
      {
        question: "Can I use IVF transfer dates here?",
        answer: "Yes, select Conception Date as the method and input the conception equivalents (e.g. transfer day plus age of embryo) to align the gestational math."
      }
    ]
  }
};
