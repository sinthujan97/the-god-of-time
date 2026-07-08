import { ToolPageData } from "../toolPageData";

export const leapYearCalculatorData: ToolPageData = {
  slug: "leap-year-calculator",
  name: "Leap Year Calculator",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#C5F135",
  description: "Check if any year is a leap year, list all leap years in a range, and see the calculation logic explained.",

  seo: {
    title: "Leap Year Calculator | List & Check Any Year",
    metaDescription: "Free leap year calculator. Check if any year is a leap year, list all leap years in a range, and calculate leap year dates. Includes formula. No signup required.",
    introText:
      "This leap year calculator lets you check any single year instantly, list every leap year across a full date range, and see the exact divisibility logic behind each result. Beyond a simple yes/no answer, this calculator shows the step-by-step calculation — divisibility by 4, then 100, then 400 — so you understand exactly why a given year qualifies, and includes a range mode most other leap year tools skip entirely. Whether you need to know how to calculate a leap year for a homework problem, verify the leap year check formula for a coding project, or pull a list of leap years for a scheduling system, this tool is built for students, developers, teachers, and calendar enthusiasts alike.",
    howToTitle: "How to Calculate a Leap Year",
    howToSteps: [
      "Step 1: Is the year divisible by 4? If no, it is not a leap year — for example, 2023 fails this test.",
      "Step 2: If divisible by 4, is it also divisible by 100? If no, it IS a leap year — this is the case for 2024, which is divisible by 4 but not 100.",
      "Step 3: If divisible by 100, is it also divisible by 400? If yes, it is a leap year (like 2000); if no, it is not (like 1900)."
    ],
    useCases: [
      {
        title: "Leap Years in a Range",
        content:
          "Between 2000 and 2100, there are 25 leap years: every year divisible by 4 except century years not divisible by 400. That means 2000 counts (divisible by 400) but 2100 does not — even though 2100 is divisible by 4, it fails the century-year exception because 2100 ÷ 400 is not a whole number. This is the single most common leap year mistake: assuming every 4th year automatically qualifies. The years 2024, 2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, and 2096 are all straightforward divisible-by-4 leap years within this range, while 2000 stands out as the only century year that qualifies (thanks to the divisible-by-400 rule) and 2100 is the notable exception that will NOT be a leap year despite the pattern suggesting otherwise. Being able to calculate leap years across a range like this is essential for anyone building calendar systems, scheduling software, or historical timelines that span a century boundary."
      }
    ],
    faqs: [
      {
        question: "What is a leap year and how is it calculated?",
        answer:
          "A leap year has 366 days instead of 365, with an extra day (February 29) added to keep the calendar aligned with Earth's orbit. The rule: a year is a leap year if it is divisible by 4, except for century years which must be divisible by 400. So 2000 and 2400 are leap years but 1900 and 2100 are not."
      },
      {
        question: "How do I know if a year is a leap year?",
        answer:
          "Apply the three-step test. First, is the year divisible by 4? If not, it is not a leap year. If yes, is it divisible by 100? If not, it is a leap year. If yes, is it divisible by 400? If yes, it is a leap year. If no, it is not. Enter any year in the calculator for an instant result with the logic explained."
      },
      {
        question: "When was the last leap year?",
        answer:
          "The most recent leap year was 2024. Before that, 2020, 2016, 2012, and 2008 were all leap years. Leap years occur every 4 years except for century years not divisible by 400. The next leap year after 2024 will be 2028."
      },
      {
        question: "What are the rules for determining leap years?",
        answer:
          "The Gregorian calendar uses three rules: years divisible by 4 are leap years; however years divisible by 100 are not leap years; except years divisible by 400 are leap years. This system ensures the calendar year stays aligned with the 365.2422-day solar year over long periods."
      },
      {
        question: "How can I calculate leap years in a range?",
        answer:
          "Enter your start and end year in the range calculator. It lists every leap year between those two dates. For a manual calculation, count every year divisible by 4, then remove century years not divisible by 400. Between 2000 and 2100 there are 25 leap years (2100 is excluded)."
      },
      {
        question: "Can I calculate my age considering leap years?",
        answer:
          "Yes — use the Age Calculator which counts exact days including all February 29ths you have experienced. If you were born on a leap day (February 29), the calculator also shows your actual birthday count versus your calendar age."
      }
    ],
    internalLinksText:
      "To calculate the exact number of days between dates, use the Days Between Dates Calculator. To calculate exact age including leap years, try the Age Calculator. To find what day of the week any date falls on, see the Day of the Week Finder.",
    relatedToolSlugs: [
      "days-between-dates",
      "age-calculator",
      "day-of-week-finder"
    ]
  }
};
