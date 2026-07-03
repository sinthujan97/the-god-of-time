import ParentChildTime from "@/components/realms/experiences/ParentChildTime";

export const metadata = {
  title: "Parent-Child Time Calculator | How Much Time Is Left? | The God of Time",
  description:
    "How much of your total parent time have you already spent? Enter birthdates and contact frequency to see the percentage gone, hours remaining, and milestones left.",
  keywords: [
    "parent time calculator",
    "time with parents",
    "parent child relationship",
    "remaining time with parents",
    "family time calculator",
  ],
  openGraph: {
    title: "Parent-Child Time Calculator | The God of Time",
    description:
      "Most people have spent over 85% of their parent time before leaving home. How much do you have left?",
    url: "https://thegodoftime.com/realms/parent-child-time",
  },
  alternates: { canonical: "https://thegodoftime.com/realms/parent-child-time" },
};

export default function ParentChildTimePage() {
  return <ParentChildTime />;
}
