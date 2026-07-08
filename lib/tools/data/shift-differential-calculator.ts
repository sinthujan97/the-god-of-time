import { ToolPageData } from "../toolPageData";

export const shiftDifferentialCalculatorData: ToolPageData = {
  slug: "shift-differential-calculator",
  name: "Shift Differential Calculator",
  group: "hr-payroll",
  groupName: "HR, Payroll & Freelance",
  groupAccent: "#A8CC1C",
  description: "Calculate night shift pay, differential rates, and overtime in seconds. Supports flat-rate and percentage premiums for any industry.",

  seo: {
    title: "Shift Differential Calculator | Free Pay Tool",
    metaDescription: "Free shift differential calculator. Calculate night shift pay, differential rates, and overtime in seconds. No signup required.",

    introText:
      "The shift differential calculator instantly shows your total pay including night shift premiums, weekend rates, and overtime adjustments. Shift differential pay is the extra percentage or flat dollar amount employers add to your base hourly rate for working non-standard hours — making accurate calculations essential for nurses, hospital staff, factory workers, security staff, warehouse employees, and anyone who regularly works outside standard 9-to-5 schedules. This shift differential pay calculator handles both flat-rate premiums (such as $2.50 per hour extra) and percentage-based differentials (such as 15% for nights), making it a reliable night shift differential calculator and shift premium calculator for any industry. Enter your base rate, premium type, and hours worked — the tool instantly shows your base earnings, premium amount, and total combined gross pay so you can verify your paycheck or plan your next shift schedule.",

    howToTitle: "How to Calculate Shift Differential Pay",
    howToSteps: [
      "Enter your base hourly rate — the standard rate you earn before any shift premium or differential is applied.",
      "Select your premium type (Flat Rate for a fixed dollar amount per hour, or Percentage for a fraction of your base rate) and enter the differential value — for example, $2.50 flat or 15% for nights.",
      "Enter the number of hours worked during the differential shift. The shift differential pay calculator instantly shows your base earnings, the premium amount, your total combined gross pay, and your effective hourly rate — use this to verify your paycheck or compare shift options.",
    ],

    useCases: [
      {
        title: "What Is Shift Differential Pay?",
        content:
          "Shift differential pay is a compensation premium added to your base hourly rate for working outside standard 9-to-5 hours — typically evening, night, weekend, or holiday shifts. This shift premium compensates employees for the social and health costs of shift work and helps employers attract workers for less desirable schedules. Unlike overtime pay, which is federally mandated under the FLSA for hours over 40 per week, night differential and shift premiums are set by employer policy, industry standards, or collective bargaining agreements. Typical rates vary by industry: healthcare workers such as nurses and technicians typically receive 10–15% for nights; manufacturing and warehouse staff commonly see 5–10%; security personnel often receive 10–20% for overnight coverage; and retail workers may see 5–15%. Differentials come in two forms — percentage-based (adding a percentage of your base rate, e.g. 15% of $20/hr = $3/hr extra) and flat-rate (a fixed dollar amount per hour, e.g. $2.50 extra regardless of base pay). Flat-rate differentials are simpler to calculate but percentage differentials scale automatically with pay increases.",
      },
      {
        title: "Shift Differential With Overtime",
        content:
          "Learning how to calculate shift differential with overtime requires knowing which of two common employer methods applies to your paycheck. Method 1 — Differential on base rate only — applies the premium to regular hours only, then calculates overtime on the base rate alone. Method 2 — Differential included in the overtime base — adds the differential to the base rate before applying time-and-a-half, resulting in higher overtime earnings. Example with real numbers: an employee earning $20/hr with a 15% night differential ($3/hr premium) works 10 hours. Under Method 1, regular 8 hrs × $23 = $184 plus overtime 2 hrs × $30 = $60, total $244. Under Method 2, regular 8 hrs × $23 = $184 plus overtime 2 hrs × $34.50 = $69, total $253 — a meaningful difference over time. Check your employment contract or HR department to confirm which method your employer uses.",
      },
    ],

    faqs: [
      {
        question: "What is a shift differential?",
        answer:
          "A shift differential is an additional percentage of pay added to your base hourly rate for working outside standard daytime hours. Employers use shift differentials to compensate employees for working evenings, nights, weekends, or holidays. Typical rates range from 5% to 30% depending on industry and employer policy.",
      },
      {
        question: "How is shift differential calculated?",
        answer:
          "Multiply your base hourly rate by the differential percentage to get the premium amount, then add it to your base rate. For example, a $20/hour employee with a 15% night differential earns $20 + ($20 × 0.15) = $23/hour on night shifts. This calculator does this math instantly for any rate and percentage combination.",
      },
      {
        question: "What factors affect shift differential pay?",
        answer:
          "The main factors are industry standards, time of shift (nights typically pay more than evenings), day of week (weekends often pay more than weekdays), and company policy. Unionized workplaces often have fixed differential rates written into collective agreements.",
      },
      {
        question: "Can I use this calculator for night shifts?",
        answer:
          "Yes. Enter your base rate, select your night shift differential percentage, and enter the hours worked on nights. The calculator shows your total earnings including the night premium separately so you can verify your paycheck easily.",
      },
      {
        question: "How do I calculate shift differential for overtime hours?",
        answer:
          "There are two methods employers use. Method 1 applies the differential to your base rate only, then calculates overtime on the base rate. Method 2 includes the differential in the overtime base, resulting in higher overtime pay. Check your employment contract to determine which method your employer uses.",
      },
      {
        question: "What is the average shift differential rate?",
        answer:
          "The national average shift differential is approximately 10–15% for night shifts and 5–10% for evening shifts. Healthcare workers typically receive 10–20%, manufacturing workers 5–15%, and security personnel 10–25%. Some employers offer flat dollar amounts instead of percentages, such as $2–3 extra per hour.",
      },
      {
        question: "How do I handle holidays in shift differential calculations?",
        answer:
          "Holiday pay is usually calculated separately from shift differentials. Most employers pay time-and-a-half or double time for holidays, and the shift differential is applied on top of the base rate before the holiday multiplier. Enter your base rate in the calculator and add both the differential percentage and holiday multiplier to see your total holiday shift earnings.",
      },
    ],

    internalLinksText:
      "To calculate overtime pay alongside shift differentials, try the Overtime Pay Calculator. For tracking total hours worked across shifts, use the Time Card Calculator. To convert your shift earnings into an annual salary, see the Hourly to Salary Converter.",
    relatedToolSlugs: [
      "overtime-pay-calculator",
      "time-card-calculator",
      "hourly-to-salary",
    ],
  },
};
