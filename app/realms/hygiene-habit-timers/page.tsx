import HygieneHabitTimers from "@/components/realms/experiences/HygieneHabitTimers";

export const metadata = {
  title: "Hygiene & Habit Timers | Jeans, Bed Sheets & Water Bottles | The God of Time",
  description: "Enter your last jeans wash, haircut, bed sheet change, and water bottle wash. See your bacterial colony status and where you stand on each hygiene threshold.",
  openGraph: { title: "Hygiene & Habit Timers | The God of Time", url: "https://thegodoftime.com/realms/hygiene-habit-timers" },
  alternates: { canonical: "https://thegodoftime.com/realms/hygiene-habit-timers" },
};

export default function HygieneHabitTimersPage() {
  return <HygieneHabitTimers />;
}
