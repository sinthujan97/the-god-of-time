import type { Metadata } from "next";
import ReactionTimeTester from "@/components/clocks/experiences/ReactionTimeTester";

export const metadata: Metadata = {
  title: "Reaction Time Tester | The God of Time",
  description: "Test your reaction speed in milliseconds. Compare to human averages. Track your personal best.",
  openGraph: {
    title: "Reaction Time Tester | The God of Time",
    description: "Test your reaction speed in milliseconds. Compare to human averages.",
    url: "https://thegodoftime.com/clocks/reaction-time",
  },
};

export default function ReactionTimePage() {
  return <ReactionTimeTester />;
}
