import PhysicalPeakDecline from "@/components/realms/experiences/PhysicalPeakDecline";

export const metadata = {
  title: "Physical Peak & Decline | When Do You Peak? | The God of Time",
  description:
    "Enter your birthdate and see every peak you've passed, which you're in now, and the surprising ones still ahead — vocabulary peaks at 67, wisdom in your 70s.",
  keywords: ["peak performance age", "athletic peak", "cognitive peak", "when do you peak", "physical decline", "vocabulary peak age"],
  openGraph: {
    title: "Physical Peak & Decline | The God of Time",
    description: "Sprint at 23, marathon at 28, vocabulary at 67. See where you stand on every human performance curve.",
    url: "/realms/physical-peak-decline",
  },
  alternates: { canonical: "/realms/physical-peak-decline" },
};

export default function PhysicalPeakDeclinePage() {
  return <PhysicalPeakDecline />;
}
