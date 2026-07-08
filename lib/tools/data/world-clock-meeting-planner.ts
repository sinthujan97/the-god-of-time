import { ToolPageData } from "../toolPageData";

export const worldClockMeetingPlannerData: ToolPageData = {
  slug: "world-clock-meeting-planner",
  name: "World Clock Meeting Planner",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#D8F870",
  description: "Find the best meeting time for teams in different time zones with a visual working-hours overlap grid.",

  seo: {
    title: "World Clock Meeting Planner | Free Time Zone Tool",
    metaDescription: "Free world clock meeting planner. Find the best meeting time for teams in different time zones. Visual overlap grid. No signup required.",
    introText:
      "This world clock meeting planner shows working hours overlap across multiple cities simultaneously, so distributed teams can find the best meeting time without a single manual time zone calculation. As a world time meeting planner, it turns the classic meeting scheduler headache — juggling three or four cities in your head — into a single visual overlap grid where the answer is simply the block of hours everyone shows green. Remote teams, global companies, distributed engineering teams, and freelancers with international clients use this tool to stop guessing at timezone overlap and start proposing meeting times with confidence.",
    howToTitle: "How to Use the World Clock Meeting Planner",
    howToSteps: [
      "Add the cities where your team members or clients are located.",
      "Review the working hours overlap grid — a 24-hour timeline showing every city's business hours side by side.",
      "Identify the green zone where every participant is simultaneously in business hours, and propose your meeting inside it."
    ],
    useCases: [
      {
        title: "Tips for Scheduling Meetings Across Time Zones",
        content:
          "The single most important habit for scheduling across time zones is finding the overlap window first, then proposing times only within it — never picking a convenient time for yourself and hoping it works elsewhere. When a true overlap doesn't exist for every participant, rotate the inconvenient slot fairly across the team so the same person isn't always the one joining at 11pm; a rotating 'bad time' is far better for morale than a fixed one. Daylight saving time is a frequent trap — an overlap window that works perfectly in winter can shift by an hour or disappear entirely once one country enters DST and another doesn't, so always recheck your window near DST transition dates. When overlap is truly impossible for your team's geographic spread, the honest answer is to record the meeting for async review rather than forcing someone into a 3am call. A few golden overlap zones recur often enough to memorize: US East Coast and the UK overlap comfortably from about 2pm-5pm EST (7pm-10pm UK time); US West Coast and India overlap in a narrow early-morning window, roughly 8am-10am PST (9:30pm-11:30pm IST); and the UK and Australia have one of the toughest overlaps in common use, limited to very early morning UK time."
      }
    ],
    faqs: [
      {
        question: "How do I use the world clock meeting planner?",
        answer:
          "Add the cities where your team members are located using the city search. The planner shows each city's current time and highlights the hours that fall within standard business hours (9am-6pm local) for each location simultaneously. The overlap zone where all cities show green is your optimal meeting window."
      },
      {
        question: "Can I customize working hours for different participants?",
        answer:
          "Yes. Click on any city's working hours to adjust the start and end of their business day. This is useful for team members who work non-standard hours, for contractors in different schedules, or for accommodating prayer times and cultural working patterns in different regions."
      },
      {
        question: "Does the planner support daylight saving time changes?",
        answer:
          "Yes. The planner automatically applies current daylight saving time offsets for all cities. When DST changes in one country but not another, the overlap window shifts. Use the date picker to check how your overlap changes on specific future dates when DST transitions occur."
      },
      {
        question: "Is there a way to compare working hours across multiple cities?",
        answer:
          "Yes — add up to 8 cities and the visual grid shows all of them simultaneously on a 24-hour timeline. Each city row is colour-coded: green for business hours, amber for early or late, dark for sleeping hours. The overlap column shows where all cities are simultaneously in business hours."
      },
      {
        question: "Can I integrate the meeting planner with my calendar?",
        answer:
          "After finding your optimal time, click the calendar export button to download a .ics file or generate a Google Calendar link pre-filled with the meeting time converted to each participant's local time zone. This eliminates the manual conversion step when inviting international attendees."
      },
      {
        question: "What happens if there is no working hours overlap?",
        answer:
          "Some team combinations have no overlap in standard business hours — for example US West Coast and India. In this case the planner highlights the closest times on either side of the gap. Options include scheduling during early morning for one party, rotating inconvenient times, or recording the meeting for async review."
      }
    ],
    internalLinksText:
      "To see current time in multiple cities at once, use the World Clock. To convert time between any two time zones, try the Time Zone Converter. To track the cost of your meeting as it runs, see the Meeting Cost Clock.",
    relatedToolSlugs: [
      "world-time-converter"
    ]
  }
};
