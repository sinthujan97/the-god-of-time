import { ToolPageData } from "../toolPageData";

export const eventCountdownBackTimerData: ToolPageData = {
  slug: "event-countdown-back-timer",
  name: "Event Back-Timer & Milestone Planner",
  group: "project-management",
  groupName: "Project Management & Business",
  groupAccent: "#8BA812",
  description: "Plan hour-by-hour schedules backward from event start times, including setup, presentations, and breaks.",
  
  seo: {
    title: "Event Back-Timer & Milestone Planner | Run of Show Calculator",
    metaDescription: "Generate a detailed event day run-of-show schedule. Calculate backward from the event start time to set setup, speaker, soundcheck, and strike times.",
    introText: "The Event Back-Timer & Milestone Planner is an event management scheduling tool. Instead of planning forward, event coordinators input the target event start time or gates-open time and work backward to establish precise times for catering setup, technical soundchecks, vendor arrival, and volunteer briefings.",
    howToTitle: "How to Back-Timer an Event Schedule",
    howToSteps: [
      "Enter the target event start time (e.g., Gates Open or Keynote Start).",
      "List the preceding event milestones (e.g., soundcheck, rehearsals, door openings) with durations in minutes.",
      "List the post-start milestones (e.g., presentations, Q&As, lunch, strike) with durations in minutes.",
      "Review the generated run-of-show timeline showing the exact hour and minute each milestone must begin.",
      "Print or export the structured timeline for vendors, crew, and stage managers."
    ],
    useCases: [
      {
        title: "Conference Keynote Run-of-Show",
        content: "Conference managers schedule keynote speakers, audio checks, panel changes, and coffee breaks down to the minute. Back-timing ensures AV crews know when to queue slides."
      },
      {
        title: "Live Concert Venue Management",
        content: "Concert producers work backward from local curfew laws and headliner sets to determine door opening times, opening act lengths, stage changeovers, and load-in schedules."
      },
      {
        title: "Wedding Day Coordination",
        content: "Wedding planners calculate hair and makeup times, photo shoots, and transportation schedules backward from the ceremony start time to avoid ceremony delays."
      }
    ],
    internalLinksText: "To plan dates across weeks rather than hours, try the Project Deadline Back-Planner. For standard date duration math, check the Days Between Dates Calculator. For session timing, use the Pomodoro Session & Break Segmenter.",
    relatedToolSlugs: [
      "project-back-planner",
      "days-between-dates",
      "pomodoro-time-segmenter"
    ],
    faqs: [
      {
        question: "What is a Run of Show (ROS) document?",
        answer: "A Run of Show is a minute-by-minute schedule that outlines all activities, cues, speakers, and media cues for an event. It coordinates production staff, technical crew, and talent during live executions."
      },
      {
        question: "Why should event setups be calculated backward?",
        answer: "Planning backward guarantees that the starting point (e.g., load-in at 8:00 AM) leaves enough time for all dependencies. If you schedule forward, a delay in soundcheck might push back the doors-open time, leading to queue delays."
      },
      {
        question: "Can I include post-event cleanup (strike) times?",
        answer: "Yes, this tool allows you to add both pre-start setup phases and post-start execution phases (including final tear-down or strike) to map the entire operational day."
      }
    ]
  }
};
