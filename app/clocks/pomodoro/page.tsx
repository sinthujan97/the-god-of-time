import type { Metadata } from "next";
import PomodoroTimer from "@/components/clocks/experiences/PomodoroTimer";

export const metadata: Metadata = {
  title: "Pomodoro Timer | The God of Time",
  description: "Full Pomodoro technique with work sessions, short breaks, long breaks, and daily session tracking.",
  openGraph: {
    title: "Pomodoro Timer | The God of Time",
    description: "Full Pomodoro technique with work sessions, short breaks, long breaks, and daily session tracking.",
    url: "https://thegodoftime.com/clocks/pomodoro",
  },
};

export default function PomodoroPage() {
  return <PomodoroTimer />;
}
