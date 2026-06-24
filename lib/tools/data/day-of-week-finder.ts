import { ToolPageData } from "../toolPageData";

export const dayOfWeekFinderData: ToolPageData = {
  slug: "day-of-week-finder",
  name: "Day of the Week Finder",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Determine which day of the week a specific historical or future date falls on.",
  
  seo: {
    title: "Day of the Week Finder | Calendar Date Day Reveal",
    metaDescription: "Find out what day of the week any past or future date falls on. Get details like day of year, week number, and date of the next occurrence.",
    introText: "The Day of the Week Finder determines which day of the week (Monday, Tuesday, etc.) any specific date lands on. Supporting any date from the year 1000 to 9999, it is perfect for finding the day of the week you were born, researching historical events, or planning future schedules.",
    howToTitle: "How to Find the Day of the Week",
    howToSteps: [
      "Select a date using the calendar date picker.",
      "See the day name revealed in large italic typeface.",
      "Check additional metrics like day of the week number (ISO), ordinal day of the year, and upcoming occurrences."
    ],
    useCases: [
      {
        title: "For Historical Research",
        content: "Determine whether major historical declarations, battles, or signatures took place on a weekend or weekday, helping establish cultural context."
      },
      {
        title: "For Personal Birthdays and Anniversaries",
        content: "Discover what weekday you were born on, or find out what day of the week your 50th wedding anniversary will be to start planning reservations."
      },
      {
        title: "For Business Planning",
        content: "Check whether scheduled project milestones or deadlines fall on weekdays, preventing situations where critical tasks end on weekends."
      }
    ],
    internalLinksText: "To find standard week layouts, use the ISO Week Number Calculator. To find standard day differences, use the Days Between Dates Calculator.",
    relatedToolSlugs: [
      "iso-week-number",
      "days-between-dates",
      "add-days-to-date"
    ],
    faqs: [
      {
        question: "Does the calculator support leap years?",
        answer: "Yes. Leap years alter day distributions. The calculator accounts for all Gregorian leap year variations to ensure the day of the week is completely accurate."
      },
      {
        question: "What is the day number representation in ISO standards?",
        answer: "Under ISO 8601, Monday is represented as 1, Tuesday as 2, and Sunday as 7. The breakdown details show this value for database alignment."
      },
      {
        question: "How far back can I search?",
        answer: "You can check any date from the year 1000 onwards. Note that the Gregorian calendar was adopted in 1582, so dates before that are calculated using proleptic Gregorian calendar conventions."
      }
    ]
  }
};
