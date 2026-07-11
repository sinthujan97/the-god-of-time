import type { Metadata } from "next";
import MeetingCostTimer from "@/components/clocks/experiences/MeetingCostTimer";
import ClockSEOContent from "@/components/clocks/ClockSEOContent";

export const metadata: Metadata = {
  title: "Meeting Cost Clock Online | Free Live Calculator",
  description:
    "Free meeting cost clock. Watch your meeting cost tick up in real time. Enter attendees and average salary. Fullscreen mode. No signup required.",
  alternates: {
    canonical: "/clocks/meeting-cost-clock-online",
  },
  openGraph: {
    title: "Meeting Cost Clock Online | Free Live Calculator",
    description:
      "Free meeting cost clock. Watch your meeting cost tick up in real time. Enter attendees and average salary.",
    url: "/clocks/meeting-cost-clock-online",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Meeting Cost Clock Online",
  url: "https://thegodoftime.com/clocks/meeting-cost-clock-online",
  description:
    "Free meeting cost clock. Watch your meeting cost tick up in real time based on attendee count and average salary.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time meeting cost ticker",
    "Attendee count and salary-based calculation",
    "Multi-currency support",
    "Exportable meeting cost summary",
  ],
};

const introText =
  "This meeting cost clock online shows the running cost of a meeting ticking up in real time, calculated from attendee count and average salary the moment you press start. Instead of an abstract sense that 'this meeting is running long,' watching a meeting cost calculator free tool climb dollar by dollar makes the cost of meeting time viscerally visible to everyone in the room. Managers tired of unnecessary meetings, productivity coaches, executives, and team leads wanting to shorten meetings use this cost of meeting calculator as a live accountability tool — not just a retrospective report.";

const sections = [
  {
    title: "How to Use the Meeting Cost Clock",
    steps: [
      "Enter the number of attendees in the meeting.",
      "Enter the average annual salary of those attendees.",
      "Press Start Meeting and watch the real-time cost ticker — calculated as (Annual Salary ÷ 2080) ÷ 60 = cost per person per minute, multiplied across all attendees."
    ],
  },
  {
    title: "The Real Cost of Meetings",
    body:
      "The average US employee costs roughly $35 per hour once fully loaded with benefits and overhead, which means a routine 1-hour meeting with 6 people costs at least $210 before anyone has produced a single deliverable. That adds up fast at scale: Harvard Business Review research puts unnecessary meetings at $37 billion per year in cost to US companies. The average employee attends 62 meetings per month, and roughly 31 of those hours per month are considered unproductive meeting time by the attendees themselves. This is precisely the problem Amazon's famous \"two-pizza rule\" was designed to solve — no meeting should be larger than a group two pizzas can feed, because every additional attendee multiplies the cost of a meeting without necessarily multiplying its value."
  },
];

const faqs = [
  {
    question: "What is a meeting cost clock?",
    answer:
      "A meeting cost clock is a real-time ticker that shows the accumulating financial cost of a meeting as it runs. It calculates cost based on the number of attendees and their average salary, updating every second to show how much the meeting has cost so far. It is designed to make the cost of meeting time viscerally visible."
  },
  {
    question: "How does the meeting cost clock work?",
    answer:
      "Enter the number of attendees and their average annual salary. The clock calculates the combined hourly rate for all attendees, then divides it into per-second increments and ticks the total cost up in real time from the moment you press start. The final figure when you end the meeting is the approximate salary cost of that meeting."
  },
  {
    question: "Can I customize the currency in the meeting cost clock?",
    answer:
      "Yes. Select your currency from the dropdown before starting the timer. The clock displays the running total in your chosen currency. This is useful for international teams and for reporting meeting costs in local currency for budget tracking purposes."
  },
  {
    question: "How can I reduce the costs of my meetings?",
    answer:
      "The most effective changes are: cut meeting length in half and see if work still gets done; reduce attendee count to only decision-makers and essential contributors; replace status update meetings with async written updates; start on time and end early; and use the meeting cost clock as a visible accountability tool during the meeting itself."
  },
  {
    question: "Can I export the meeting cost summary?",
    answer:
      "Yes. When you end the meeting, click Export to copy or download a summary showing total duration, attendee count, salary input, and total calculated cost. This can be shared in retrospectives or used for internal reporting on meeting culture."
  },
  {
    question: "What is the average cost of a one-hour meeting?",
    answer:
      "A one-hour meeting with 5 employees earning an average of $75,000 per year costs approximately $180 in direct salary cost alone ($75,000 ÷ 2080 hours × 5 people). Including fully loaded costs (benefits, overhead), the real cost is typically 1.3-1.5x the salary figure, putting a 5-person hour-long meeting at $234-$270 in total cost."
  },
];

const relatedLinks = [
  { href: "/tools/world-clock-meeting-planner", name: "World Clock Meeting Planner" },
  { href: "/clocks/presentation-timer-online", name: "Presentation Timer" },
  { href: "/tools/overtime-pay-calculator", name: "Overtime Pay Calculator" },
];

export default function MeetingCostTimerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <MeetingCostTimer />
      <ClockSEOContent
        introText={introText}
        sections={sections}
        faqs={faqs}
        relatedLinks={relatedLinks}
        accent="#FBBF24"
      />
    </>
  );
}
