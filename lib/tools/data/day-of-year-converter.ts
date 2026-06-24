import { ToolPageData } from "../toolPageData";

export const dayOfYearConverterData: ToolPageData = {
  slug: "day-of-year-converter",
  name: "Day of the Year Ordinal Converter",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Convert any date to its ordinal day of the year (1-366) and vice versa.",
  
  seo: {
    title: "Day of the Year Converter | Ordinal Calendar Date Finder",
    metaDescription: "Convert calendar dates to ordinal day numbers (1-365/366) or convert ordinal days back to calendar dates. Full leap year support.",
    introText: "The Day of the Year Ordinal Converter translates standard calendar dates (month/day/year) into their equivalent ordinal day numbers (ranging from 1 to 365, or 366 in leap years) and converts day numbers back to dates. Popular in computer science, military logistics, and weather tracking, the ordinal date simplifies duration arithmetic and database indexing.",
    howToTitle: "How to Convert Ordinal Dates",
    howToSteps: [
      "Select 'Date to Ordinal' tab to enter a calendar date and find its day number.",
      "Select 'Ordinal to Date' tab to enter an ordinal day number (1-366) and year to find the exact calendar date.",
      "Review additional metrics like remaining days in the year and percentage of the year completed."
    ],
    useCases: [
      {
        title: "For Logistics and Supply Chain Systems",
        content: "Logistics labels (such as Julian dates on manufacturing seals) use ordinal numbering to track production dates. E.g. a label marked '24047' represents day 47 of 2024 (February 16th)."
      },
      {
        title: "For Astronomical & Meteorological Records",
        content: "Scientific reports record seasonal variations and satellite data by day numbers to keep data independent of irregular monthly calendar subdivisions."
      },
      {
        title: "For Database Query Indexing",
        content: "Database developers index temporal entries by day number to simplify comparisons and execute range selections efficiently without heavy date conversions."
      }
    ],
    internalLinksText: "To find standard week numbers instead, use the ISO Week Number Calculator. To find standard weekdays, use the Day of the Week Finder.",
    relatedToolSlugs: [
      "iso-week-number",
      "day-of-week-finder",
      "days-between-dates"
    ],
    faqs: [
      {
        question: "What is an ordinal day of the year?",
        answer: "An ordinal day is a single number representing the position of a calendar day in the year, starting with January 1st as Day 1 and ending with December 31st as Day 365 (or 366 in leap years)."
      },
      {
        question: "How does the tool handle February 29th?",
        answer: "The tool automatically verifies if the selected or entered year is a leap year, ensuring that dates after February 28th are offset correctly based on the presence of February 29th."
      },
      {
        question: "Is this the same as a Julian date?",
        answer: "In manufacturing and logistics, the term 'Julian date' is often colloquially used to describe the ordinal day format. However, in astronomy, a Julian date refers to a continuous count of days since 4713 BC."
      }
    ]
  }
};
