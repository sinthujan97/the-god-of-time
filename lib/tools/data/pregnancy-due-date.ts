import { ToolPageData } from "../toolPageData";

export const pregnancyDueDateData: ToolPageData = {
  slug: "pregnancy-due-date-calculator",
  name: "Pregnancy Due Date Calculator",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#B2D828",
  description: "Calculate estimated pregnancy due dates using your last menstrual period (LMP) or conception dates.",

  seo: {
    title: "Pregnancy Due Date Calculator | Free EDD Tool",
    metaDescription: "Free pregnancy due date calculator. Find your estimated due date from last period or conception date. Shows trimester dates and key milestones. No signup required.",
    introText: "This pregnancy due date calculator estimates your due date (EDD — estimated due date) from your last menstrual period or conception date using Naegele's rule. It's important to remember this is an estimate — always confirm your due date with your healthcare provider. People search for an accurate due date calculator, a due date calculator based on conception, a pregnancy calculator by LMP, a pregnancy week calculator, or an IVF due date calculator, and this tool covers all of those methods in one place. It's built for newly pregnant individuals calculating their EDD before their first appointment, along with partners and family members who want the same numbers.",
    howToTitle: "How to Track Due Dates",
    howToSteps: [
      "Select your calculation method: Last Menstrual Period (LMP) or Conception Date.",
      "Input the corresponding start date using the calendar picker.",
      "Adjust the average cycle length slider (defaults to 28 days).",
      "Observe the calculated estimated due date, gestational age, and progress percentage immediately."
    ],
    sections: [
      {
        title: "How Is a Pregnancy Due Date Calculated?",
        body: "The standard medical method is Naegele's Rule: add 280 days (40 weeks) to the first day of your last menstrual period (LMP), which is equivalent to adding 9 months and 7 days to your LMP. That 280-day figure comes from assuming a 28-day cycle with ovulation at day 14, conception around day 14, and 266 days of fetal development from there. For IVF pregnancies, the calculation is different: a Day 3 embryo transfer adds 263 days from the transfer date, while a Day 5 blastocyst transfer adds 261 days. If you know your actual conception date, adding 266 days directly to it is a slightly more accurate method than LMP-based calculation, particularly if ovulation didn't occur precisely on day 14 of your cycle. One important caveat to keep in mind: only about 4% of babies are born exactly on their estimated due date. The normal delivery window spans 38 to 42 weeks, and first-time mothers deliver an average of 8 days after their EDD. Ultrasound dating after 10 weeks tends to be more accurate than LMP calculation for anyone with irregular cycles."
      },
      {
        title: "Key Pregnancy Milestones by Week",
        body: "Week 4 brings a missed period and the earliest positive test. Weeks 6-8 is when the first heartbeat becomes detectable. Weeks 10-12 is the first trimester screening window, with week 12 marking the end of the first trimester. Weeks 13-14 typically include the NT scan (nuchal translucency). Weeks 18-20 bring the anatomy scan, often when a gender reveal happens. Week 24 is the viability milestone. Week 28 marks the start of the third trimester. Week 36 is when full-term preparations typically begin, with week 37 considered early term and weeks 39-40 considered full term — week 40 being the due date itself. Week 41 is late term, and week 42 is post term, at which point a medical review is typical. This calculator maps each of these milestones to a real calendar date based on your specific EDD."
      }
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
    internalLinksText: "Calculate exactly how many days until your due date with the Days Between Dates Calculator, or calculate your baby's age after birth with the Age Calculator.",
    relatedToolSlugs: [
      "days-between-dates",
      "age-calculator"
    ],
    faqs: [
      {
        question: "How is my pregnancy due date calculated?",
        answer: "The standard method uses Naegele's Rule: add 280 days (40 weeks) to the first day of your last menstrual period. This assumes a 28-day cycle and ovulation on day 14. If your cycle is shorter or longer than 28 days, the calculator adjusts accordingly. All due dates are estimates — confirm with your healthcare provider, who may update your EDD after an early ultrasound."
      },
      {
        question: "What methods can I use to determine my due date?",
        answer: "Three methods are available: last menstrual period (LMP) — the most commonly used, requires knowing the date of your last period; conception date — more precise if you know when conception occurred, adds 266 days; and IVF transfer date — for IVF pregnancies, uses the embryo transfer date and whether a day 3 or day 5 blastocyst transfer was performed."
      },
      {
        question: "How does conception date affect my due date?",
        answer: "If ovulation occurred on a day other than day 14 of your cycle, the LMP-based calculation may be off by several days. Entering your known conception date instead gives a more accurate EDD if you tracked ovulation. The conception-based EDD is calculated by adding 266 days (38 weeks) to the conception date."
      },
      {
        question: "What is the difference between LMP and conception-based due date calculations?",
        answer: "LMP-based calculation (Naegele's Rule) adds 280 days to the start of your last period and assumes conception occurred approximately 14 days later. Conception-based calculation adds 266 days directly to the known conception date. For regular 28-day cycles both methods produce the same result. For irregular cycles or confirmed ovulation dates, conception-based calculation is more accurate."
      },
      {
        question: "How accurate is the pregnancy due date calculator?",
        answer: "The EDD is an estimate with typical accuracy of ±2 weeks. Only 4% of babies are born exactly on their due date. The majority deliver within one week either side. Ultrasound measurements between 8 and 20 weeks gestation are more accurate than LMP calculation, particularly for women with irregular cycles, and may result in your healthcare provider adjusting your estimated due date."
      },
      {
        question: "What are the key milestones during pregnancy?",
        answer: "The first trimester ends at week 12, the second at week 28, and the third continues to delivery. Key clinical milestones include the first heartbeat at 6-8 weeks, first trimester screening at 10-14 weeks, anatomy scan at 18-20 weeks, viability at 24 weeks, and full term from 37 weeks. Your calculator shows the calendar dates for each of these milestones based on your EDD."
      },
      {
        question: "Can the calculator support IVF conception dates?",
        answer: "Yes. Select IVF in the calculation method dropdown, choose whether your transfer was a Day 3 embryo or Day 5 blastocyst (embryo), and enter the transfer date. The calculator applies the appropriate offset — 263 days for Day 3 and 261 days for Day 5 blastocyst — to estimate your EDD. IVF due date calculations are generally more precise than LMP-based calculations as the exact fertilization date is known."
      },
      {
        question: "Does cycle length alter gestational week math?",
        answer: "Yes, adjusting for longer or shorter cycles shifts the estimated ovulation window, protecting the accuracy of early tracking milestones."
      }
    ]
  }
};
