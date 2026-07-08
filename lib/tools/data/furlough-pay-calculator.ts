import { ToolPageData } from "../toolPageData";

export const furloughPayCalculatorData: ToolPageData = {
  slug: "furlough-pay-calculator",
  name: "Furlough Pay Calculator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Calculate the monthly and total financial impact of unpaid leaves, furlough days, or temporary work suspensions.",

  seo: {
    title: "Furlough Pay Calculator | Free Furlough Estimator",
    metaDescription: "Free furlough pay calculator. Calculate income loss from unpaid furlough days, adjusted monthly salary, and equivalent annual pay. No signup required.",
    introText:
      "The furlough pay calculator instantly shows how much income you lose when required to take unpaid furlough days, and recalculates your adjusted monthly and annual salary equivalent. A furlough is a temporary mandatory unpaid leave ordered by an employer to reduce labor costs without permanently laying off staff — furloughed employees typically keep their benefits and return to work after the program ends. Whether you are facing one furlough day per month for three months or multiple days per week during a crisis period, this free furlough pay calculator gives you a precise dollar figure for your income reduction, an adjusted monthly paycheck amount, and a total loss projection for the full furlough duration.",
    howToTitle: "How to Calculate Furlough Pay Impact",
    howToSteps: [
      "Enter your base annual salary (e.g., $75,000) — this is your gross salary before any furlough reduction.",
      "Specify the number of unpaid furlough days required per month (e.g., 2 days per month).",
      "Enter the duration of the furlough program in months (e.g., 6 months).",
      "Set the average working days per month (standard is 21.67 days) — adjust if your employer uses a different divisor.",
      "Review your total income lost, adjusted monthly pay, percentage reduction, and equivalent adjusted annual salary."
    ],
    useCases: [
      {
        title: "What Is Furlough Pay?",
        content:
          "Furlough pay refers to the reduced compensation an employee receives when placed on a mandatory unpaid leave schedule by their employer. Unlike a standard pay cut — which permanently reduces your salary — a furlough is temporary and typically affects specific days per pay period. The financial impact depends on two factors: the number of furlough days per month and the duration of the program. For a salaried employee earning $75,000 per year ($6,250/month), a furlough of 2 days per month (out of 21.67 average working days) reduces monthly gross pay by $6,250 × (2 ÷ 21.67) = $577 per month. Over a 6-month furlough program, the total income loss is $3,464. This furlough pay calculator performs this math instantly for any salary, furlough frequency, and program length, helping employees budget for the shortfall and employers model the cost savings from avoiding permanent layoffs."
      },
      {
        title: "Furlough vs. Pay Cut: Which Costs More?",
        content:
          "Employees and HR teams often need to compare the financial impact of a furlough program against a straight salary reduction. A furlough of 1 day per week (approximately 4.33 days per month) on a $60,000 salary produces a monthly loss of $60,000 ÷ 12 ÷ 21.67 × 4.33 = $1,000/month — equivalent to a 20% pay cut (since 4.33 ÷ 21.67 ≈ 20%). A flat 10% salary cut on the same salary produces a $500/month loss. In this case the furlough is more costly. However, furloughs have an important practical advantage: the unpaid days are time off that employees actually take, providing rest and personal flexibility, while a pay cut provides no time benefit. For HR planning, furloughs also have different accounting treatment — furlough savings are immediate cash savings without changing the headcount or benefits cost structure."
      }
    ],
    faqs: [
      {
        question: "What is a furlough?",
        answer:
          "A furlough is a temporary, mandatory unpaid leave of absence from work ordered by an employer to reduce labor costs. Unlike laid-off workers, furloughed employees typically retain their benefits and return to their jobs once the furlough period ends."
      },
      {
        question: "How is my daily pay rate calculated?",
        answer:
          "For salaried employees, the daily rate is your annual salary divided by the number of working days in a year. This calculator uses a monthly approach: monthly salary ÷ average working days per month (default 21.67). Each furlough day deducts one daily rate from your monthly pay."
      },
      {
        question: "Does a furlough affect my benefits like health insurance?",
        answer:
          "In most cases, furloughed employees retain their benefits including health insurance, retirement contributions, and accrued PTO. This distinguishes furloughs from layoffs, where benefits typically cease. Confirm with your HR department as policies vary by employer and jurisdiction."
      },
      {
        question: "Can I collect unemployment during a furlough?",
        answer:
          "In many US states, employees on partial furlough (reduced hours or days) may qualify for partial unemployment benefits to offset the lost wages. Eligibility depends on your state's rules and the extent of the reduction. A full-week furlough (complete work stoppage for one week) typically qualifies more readily than a one-day-per-week reduction."
      },
      {
        question: "Does the calculator account for tax differences during furloughs?",
        answer:
          "This tool calculates gross pay impacts only. Because your total annual income is lower during a furlough, your effective tax rate may also decrease slightly, meaning your net take-home pay reduction could be smaller than the gross loss shown here."
      },
      {
        question: "How does a furlough differ from a layoff?",
        answer:
          "A furlough is temporary — employees remain employed with benefits intact and are expected to return to full hours when the program ends. A layoff permanently terminates employment, ending benefits and requiring re-hiring when business conditions improve. Furloughs are preferred when the employer expects to need the workforce again within months."
      }
    ],
    internalLinksText:
      "To estimate your net take-home pay after furlough reductions, use the Gross-to-Net Time Pay Sheet. To calculate PTO accrual changes during reduced schedules, try the PTO Accrual Calculator. To convert annual salary to hourly rates, see the Salary to Hourly Calculator.",
    relatedToolSlugs: [
      "gross-to-net-pay",
      "salary-to-hourly",
      "pto-accrual-calculator"
    ]
  }
};
