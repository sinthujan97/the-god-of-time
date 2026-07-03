import SingularityTimeline from "@/components/realms/experiences/SingularityTimeline";

export const metadata = {
  title: "The Singularity Timeline | AI Milestones & 2045 Countdown | The God of Time",
  description:
    "Every AI milestone from 1950 to the predicted 2045 Singularity — with live countdowns to events still coming. Deep Blue, AlphaGo, ChatGPT, AGI, and beyond.",
  keywords: [
    "singularity timeline",
    "AI milestones",
    "2045 singularity",
    "ray kurzweil",
    "AGI countdown",
    "artificial intelligence history",
    "technology timeline",
  ],
  openGraph: {
    title: "The Singularity Timeline | The God of Time",
    description:
      "From Turing's question in 1950 to the Singularity in 2045 — live countdowns to every predicted AI milestone.",
    url: "https://thegodoftime.com/realms/singularity-timeline",
  },
  alternates: { canonical: "https://thegodoftime.com/realms/singularity-timeline" },
};

export default function SingularityTimelinePage() {
  return <SingularityTimeline />;
}
