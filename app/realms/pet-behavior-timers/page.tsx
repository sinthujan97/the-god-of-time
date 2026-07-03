import PetBehaviorTimers from "@/components/realms/experiences/PetBehaviorTimers";

export const metadata = {
  title: "Pet Behavior Timers | Dog & Cat Countdown Clocks | The God of Time",
  description: "Live countdown timers for pet behavior — food demand loops, 3AM zoomie countdowns, separation anxiety onset, nap cycle tracking. Scientifically approximate.",
  openGraph: { title: "Pet Behavior Timers | The God of Time", url: "https://thegodoftime.com/realms/pet-behavior-timers" },
  alternates: { canonical: "https://thegodoftime.com/realms/pet-behavior-timers" },
};

export default function PetBehaviorTimersPage() {
  return <PetBehaviorTimers />;
}
