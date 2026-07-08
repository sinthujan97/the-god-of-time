import { ToolPageData } from "../toolPageData";

export const semiMonthlyPayCalculatorData: ToolPageData = {
  slug: "semi-monthly-pay-calculator",
  name: "Semi Monthly Pay Calculator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Calculate gross pay per period for twice-a-month schedules. Convert annual salary to semi-monthly paychecks and generate upcoming pay dates instantly.",

  seo: {
    title: "Semi Monthly Pay Calculator | Free Paycheck Tool",
    metaDescription: "Free semi monthly pay calculator. Convert annual salary to semi monthly paychecks instantly. See gross and net pay for 1st and 15th pay dates. No signup required.",
    introText:
      "The semi monthly pay calculator instantly converts your annual salary or hourly rate into your exact gross paycheck for each of your 24 annual pay periods. Semi-monthly pay schedules pay employees twice a month — typically on the 1st and 15th, or the 15th and last working day of each month — and are widely used by salaried employees in corporate, healthcare, and government roles. This free semi monthly paycheck calculator shows your per-period gross pay, how weekend date adjustments shift your actual pay dates, and a forward-looking schedule of upcoming paydates so you can plan mortgage payments, auto-debits, and savings cycles with confidence.",
    howToTitle: "How to Calculate Semi Monthly Pay",
    howToSteps: [
      "Select your pay basis — Annual Salary or Hourly Rate — and enter your pay amount.",
      "If hourly, enter your average work hours per week so the calculator can convert to an annual equivalent.",
      "Enter your first paydate to anchor the schedule (e.g., January 1 or January 15).",
      "Review your gross pay per period, annual salary equivalent, and the upcoming paydate schedule with weekend adjustment flags."
    ],
    useCases: [
      {
        title: "What Is Semi Monthly Pay?",
        content:
          "Semi-monthly pay means receiving a paycheck exactly twice per calendar month, producing 24 pay periods per year. The most common schedule pays on the 1st and 15th of each month, though some employers use the 15th and last day. Unlike bi-weekly pay (which produces 26 pay periods because it follows a strict 14-day cycle), semi-monthly pay ties to calendar dates. This means the number of working days between paychecks varies — some periods cover 15 days and others 16, depending on weekends and holidays. For salaried employees, each semi-monthly paycheck is simply your annual salary divided by 24, making gross pay predictable and constant. For hourly workers, your actual hours in each period will vary slightly, so this semi monthly pay calculator uses your weekly hours and an average days-per-period to project your per-period gross earnings."
      },
      {
        title: "Semi Monthly vs Biweekly Pay",
        content:
          "The most common confusion in payroll is semi-monthly vs bi-weekly pay. Both result in two paychecks per month most of the time, but bi-weekly pay produces 26 pay periods per year while semi-monthly produces exactly 24. For a salaried employee earning $60,000 per year: bi-weekly gross pay is $60,000 ÷ 26 = $2,307.69 per check, while semi-monthly gross pay is $60,000 ÷ 24 = $2,500 per check — a $192.31 difference per paycheck. Over the year both add up to $60,000, but the timing differs. Two months per year on a bi-weekly schedule you receive three paychecks, which can feel like a windfall but must be budgeted carefully for quarterly expenses. With semi-monthly, budgeting is simpler because your check dates are always tied to calendar dates and your gross amount never changes."
      }
    ],
    faqs: [
      {
        question: "How many pay periods are in a semi-monthly schedule?",
        answer:
          "A semi-monthly schedule has exactly 24 pay periods per year — twice per month for 12 months. This is different from a bi-weekly schedule which has 26 pay periods per year."
      },
      {
        question: "How do I calculate my semi-monthly paycheck from annual salary?",
        answer:
          "Divide your annual salary by 24. For example, a $72,000 annual salary produces a gross semi-monthly paycheck of $72,000 ÷ 24 = $3,000. This calculator does this instantly and also handles weekend date adjustments."
      },
      {
        question: "What happens when a pay date falls on a weekend?",
        answer:
          "Most employers pay on the preceding Friday when a scheduled pay date (such as the 15th or the 1st) falls on a Saturday or Sunday. Some pay on the following Monday. This calculator applies the preceding-Friday rule automatically and highlights adjusted dates."
      },
      {
        question: "How is an hourly rate converted to semi-monthly pay?",
        answer:
          "The hourly rate is multiplied by your weekly hours to get weekly earnings, then multiplied by 52 weeks for an annual equivalent, and finally divided by 24 pay periods. For example: $25/hour × 40 hours × 52 weeks = $52,000 annual ÷ 24 = $2,166.67 per semi-monthly period."
      },
      {
        question: "What is the difference between semi-monthly and biweekly pay?",
        answer:
          "Semi-monthly pay happens on fixed calendar dates (e.g., 1st and 15th) producing 24 pay periods per year. Biweekly pay happens every 14 days regardless of the calendar, producing 26 pay periods per year. The per-paycheck amount differs: on $60,000/year, semi-monthly pays $2,500 vs biweekly's $2,307.69."
      },
      {
        question: "Is semi-monthly pay common for salaried employees?",
        answer:
          "Yes. Semi-monthly pay is particularly common among salaried employees in corporate, healthcare, government, and education sectors. It aligns with monthly accounting cycles and produces consistent paycheck amounts, making it easier to predict cash flow."
      }
    ],
    internalLinksText:
      "To calculate overtime pay across pay periods, use the Overtime Pay Calculator. To compare bi-weekly timesheet totals, try the Free Biweekly Timesheet Calculator. To convert salary to hourly, see the Salary to Hourly Calculator.",
    relatedToolSlugs: [
      "payroll-period-planner",
      "free-biweekly-timesheet-calculator",
      "hourly-to-salary"
    ]
  }
};
