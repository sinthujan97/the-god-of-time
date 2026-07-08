import { ToolPageData } from "../toolPageData";

export const commissionPerHourCalculatorData: ToolPageData = {
  slug: "commission-per-hour-calculator",
  name: "Commission Per Hour Calculator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Convert sales commissions into hourly rate equivalents and evaluate combined compensation structures for sales professionals.",

  seo: {
    title: "Commission Per Hour Calculator | Free Sales Tool",
    metaDescription: "Free commission per hour calculator. Convert sales commissions into hourly equivalents instantly. Calculate your true hourly rate including base pay. No signup required.",
    introText:
      "The commission per hour calculator converts your earned sales commissions into a true hourly rate so you can compare commission-based roles against salaried or wage positions on an apples-to-apples basis. Understanding your commission per hour reveals whether your hustle hours are generating meaningful compensation or whether your effective hourly rate falls below minimum wage during slow sales months. This free commission calculator combines your base salary and commission income, divides by total hours worked, and produces your blended effective hourly rate — an essential metric for sales professionals, managers building compensation structures, and job seekers comparing offers.",
    howToTitle: "How to Calculate Commission Per Hour",
    howToSteps: [
      "Enter the total commission amount earned during the pay period (e.g., $1,800 in commissions for the month).",
      "Enter the total hours worked to earn that commission (e.g., 80 hours across two weeks).",
      "Enter your base salary for the same period and the standard hours that base covers, if applicable.",
      "Review your commission rate per hour, base hourly rate, combined effective hourly rate, and the commission percentage of your total compensation."
    ],
    useCases: [
      {
        title: "What Is Commission Per Hour?",
        content:
          "Commission per hour is the dollar value of commissions earned divided by the number of hours worked during the same period. It translates variable commission income — which fluctuates with sales volume — into a consistent hourly metric that can be compared to standard wage offers. For example, if you earned $1,800 in commissions over 80 working hours, your commission per hour is $22.50. If your base pay adds another $25/hour, your total blended rate is $47.50/hour. Knowing your commission per hour is critical during months when pipeline is thin — if your commissions drop to $400 over the same 80 hours, your commission per hour falls to just $5, and your effective blended rate drops to $30/hour. Tracking this metric monthly helps sales professionals identify which activities and accounts generate the most value per hour of effort."
      },
      {
        title: "Commission Structure Comparison",
        content:
          "When evaluating job offers or compensation redesigns, converting all pay to a per-hour basis enables fair comparison. A role offering $50,000 base plus $30,000 commission target over 2,080 annual hours yields a blended rate of $80,000 ÷ 2,080 = $38.46/hour at quota. Compare this to a straight-salary role at $70,000 producing $33.65/hour — the commission role pays more per hour at quota, but carries risk if commission targets are not met. This commission per hour calculator lets you model multiple scenarios by changing the commission amount to reflect different performance levels (50% quota, 75% quota, 100% quota) so you can see your effective hourly floor and ceiling before accepting an offer."
      }
    ],
    faqs: [
      {
        question: "How do I calculate my commission per hour?",
        answer:
          "Divide your total commissions earned by the hours worked during the same period. For example, $2,400 in commissions ÷ 80 hours = $30 commission per hour. This calculator also combines commission with base pay to show your full blended effective hourly rate."
      },
      {
        question: "What is a combined effective hourly rate?",
        answer:
          "Your combined effective hourly rate is your total earnings — base salary plus commissions — divided by total hours worked. It shows your true hourly compensation rather than just the fixed portion of your pay."
      },
      {
        question: "Can I use this to compare commission-only vs base-plus-commission jobs?",
        answer:
          "Yes. Set the base salary to $0 and enter just your commission amount for a commission-only role. Then compare against a base-plus-commission structure to see which pays more per hour at different performance levels."
      },
      {
        question: "What does 'break-even hours' mean for sales?",
        answer:
          "Break-even hours show how many hours you must work on commission activity alone to equal your base salary. If commissions cover your base at a certain pace, you're self-sustaining. If commissions fall below base level, your employer is subsidizing your time."
      },
      {
        question: "How do I calculate commission percentage of total pay?",
        answer:
          "Divide your commission earnings by your total earnings (base + commission) and multiply by 100. For example, $1,500 commission ÷ $3,500 total = 42.9% of pay is variable commission income. This helps assess pay stability risk."
      },
      {
        question: "Does this calculator work for tiered commission structures?",
        answer:
          "Yes — enter the final commission payout you received after any tier calculations, overrides, or splits. The calculator works on the actual dollars earned and hours worked regardless of how the commission was structured upstream."
      }
    ],
    internalLinksText:
      "To convert hourly wages to annual salary, use the Hourly to Salary Converter. To calculate shift premium earnings on top of base pay, try the Shift Differential Calculator. For gross-to-net take-home estimates, see the Gross-to-Net Pay Sheet.",
    relatedToolSlugs: [
      "hourly-to-salary",
      "salary-to-hourly",
      "shift-differential-calculator"
    ]
  }
};
