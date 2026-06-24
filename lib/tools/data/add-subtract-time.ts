import { ToolPageData } from "../toolPageData";

export const addSubtractTimeData: ToolPageData = {
  slug: "add-subtract-time",
  name: "Add/Subtract Time Calculator",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#52C4A0",
  description: "Add or subtract hours, minutes, and seconds from any time of day to find a precise result time.",
  
  seo: {
    title: "Add or Subtract Time Calculator | Timestamp Math",
    metaDescription: "Add or subtract hours, minutes, and seconds from any time. Find result times that cross midnight automatically. Free timestamp duration calculator.",
    introText: "The Add/Subtract Time Calculator finds the exact resulting time when you add or remove a specific duration of hours, minutes, and seconds from any starting time. It handles midnight crossings automatically — adding 5 hours to 10:00 PM correctly returns 3:00 AM the next day. Use it for scheduling, shift planning, video editing timestamps, and any workflow that requires precise time arithmetic.",
    howToTitle: "How to Add or Subtract Time from a Start Time",
    howToSteps: [
      "Enter your base time — the time you are starting from. This can be any time in 24-hour or 12-hour format.",
      "Select Add or Subtract and enter the duration in hours, minutes, and seconds. You can mix all three units — for example, add 2 hours 45 minutes 30 seconds.",
      "Read the result time. If the calculation crosses midnight, the result shows the correct time with a note indicating the result falls on the next or previous day."
    ],
    useCases: [
      {
        title: "For Broadcast and Production Scheduling",
        content: "Television producers, podcast editors, and live event coordinators work with precise timestamp arithmetic constantly. Adding segment durations to a start time, calculating when a program block ends, or finding the exact timestamp for a cue all require this type of time addition."
      },
      {
        title: "For Shift and Roster Planning",
        content: "Add a shift duration to a start time to find the exact end time. A shift starting at 22:30 and running for 8 hours ends at 06:30 the following morning — the calculator flags the midnight crossing automatically."
      },
      {
        title: "For Cooking and Recipe Timing",
        content: "If you need a dish ready at 7:00 PM and preparation takes 2 hours 30 minutes, subtract the prep time from the serving time to find your exact start time. Precise time subtraction eliminates the mental arithmetic during meal preparation."
      },
      {
        title: "For Developer Timestamp Calculations",
        content: "Software developers working with log files, API response times, and event timestamps frequently need to add or subtract precise durations from timestamp values. This tool handles the arithmetic instantly without requiring custom code."
      }
    ],
    internalLinksText: "To calculate how many hours elapsed between two specific times rather than adding a duration, use the Time Duration Calculator. For converting the result to decimal hours for payroll, use the Decimal Time Converter. To track multiple work segments, use the Working Hours Tracker.",
    relatedToolSlugs: [
      "time-duration-calculator",
      "decimal-time-converter",
      "working-hours-tracker"
    ],
    faqs: [
      {
        question: "What happens when the result crosses midnight?",
        answer: "The calculator detects midnight crossings automatically. If you add time that pushes past 23:59, the result wraps to the correct early morning time and displays a note that the result falls on the next day."
      },
      {
        question: "Can I add more than 24 hours?",
        answer: "Yes. Adding more than 24 hours wraps the result correctly and shows the number of days offset. Adding 36 hours to 12:00 PM returns 12:00 AM with a note showing the result is 1 day and 12 hours later."
      },
      {
        question: "Can I mix hours, minutes, and seconds?",
        answer: "Yes. Enter any combination across the three fields. You can add 1 hour, 45 minutes, and 30 seconds simultaneously — the calculator converts everything to seconds internally before computing the result."
      },
      {
        question: "How do I find a start time from an end time and duration?",
        answer: "Use Subtract mode. Enter your desired end time as the base time, then subtract the duration. The result is the start time you need to begin in order to finish at your target end time."
      },
      {
        question: "Does this work for timestamps in different formats?",
        answer: "The tool accepts both 24-hour and 12-hour time input. Toggle the format using the Format option. The result always shows both formats in the breakdown regardless of which input format you used."
      }
    ]
  }
};
