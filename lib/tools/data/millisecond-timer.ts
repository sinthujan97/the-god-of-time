import { ToolPageData } from "../toolPageData";

export const millisecondTimerData: ToolPageData = {
  slug: "millisecond-timer",
  name: "Millisecond Timer & Delta Counter",
  group: "utility-a",
  groupName: "Standard Time & Date",
  groupAccent: "#C5F135",
  description: "A precision timer showing elapsed milliseconds, lap logs, and delta gaps.",
  
  seo: {
    title: "Millisecond Timer | Online Stopwatch & Delta Counter",
    metaDescription: "A high-precision online stopwatch with millisecond accuracy. Features lap logging, lap delta calculations, start, stop, and reset buttons.",
    introText: "The Millisecond Timer & Delta Counter is a professional-grade online stopwatch designed for precision timing. Unlike standard stopwatches that round to tenths of a second, this tool displays hours, minutes, seconds, and milliseconds (HH:MM:SS.mmm). It includes a lap tracker with an optional Delta mode to calculate time intervals between consecutive laps, using browser APIs for timing accuracy.",
    howToTitle: "How to Use the Millisecond Stopwatch",
    howToSteps: [
      "Click the 'Start' button to begin timing.",
      "Click the 'Lap' button to record split times while the timer continues running. Toggle 'Delta Mode' to see elapsed time since the previous lap instead of overall elapsed time.",
      "Click 'Stop' to pause the timer, and 'Reset' to clear all recorded lap data and return the clock to zero."
    ],
    useCases: [
      {
        title: "For Athletics and Training Splits",
        content: "Track running, swimming, or cycling laps. Recording millisecond-accurate splits is essential for monitoring training improvements and pacing."
      },
      {
        title: "For Usability and Speed Testing",
        content: "Use the timer to measure task completion rates, screen load speeds, or human interaction speeds in physical and digital testing labs."
      },
      {
        title: "For Audio, Video, and Script Timing",
        content: "Broadcast editors and script coordinators timing segments need millisecond precision to fit content within fixed scheduling slots."
      }
    ],
    internalLinksText: "To calculate duration between two dates instead of live tracking, use the Days Between Dates Calculator. To add or subtract durations, use the Add/Subtract Time Calculator.",
    relatedToolSlugs: [
      "days-between-dates",
      "time-duration-calculator",
      "add-subtract-time"
    ],
    faqs: [
      {
        question: "How accurate is the millisecond timer?",
        answer: "The timer uses the browser's performance.now() API, which provides a sub-millisecond resolution timestamp, making it significantly more accurate than standard JavaScript Date.now() methods."
      },
      {
        question: "What is Delta Mode in lap tracking?",
        answer: "Delta Mode shifts the lap breakdown to show the time differences between consecutive laps rather than cumulative elapsed time, allowing you to quickly spot speed increases or decreases."
      },
      {
        question: "Does the timer keep running if I switch browser tabs?",
        answer: "Yes. By basing the elapsed duration on high-precision browser timestamps (referencing performance.now() relative offsets), the clock stays completely accurate even if tab rendering is throttled in the background."
      }
    ]
  }
};
