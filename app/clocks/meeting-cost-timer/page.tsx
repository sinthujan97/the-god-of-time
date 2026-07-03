import type { Metadata } from "next";
import MeetingCostTimer from "@/components/clocks/experiences/MeetingCostTimer";

export const metadata: Metadata = {
  title: "Meeting Cost Timer | The God of Time",
  description: "Input attendees and salary. Watch the cost of this meeting tick up in real time.",
  openGraph: {
    title: "Meeting Cost Timer | The God of Time",
    description: "Input attendees and salary. Watch the cost of this meeting tick up in real time.",
    url: "https://thegodoftime.com/clocks/meeting-cost-timer",
  },
};

export default function MeetingCostTimerPage() {
  return <MeetingCostTimer />;
}
