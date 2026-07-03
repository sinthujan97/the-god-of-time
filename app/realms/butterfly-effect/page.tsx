import ButterflyEffect from "@/components/realms/experiences/ButterflyEffect";

export const metadata = {
  title: "Butterfly Effect | Alter History, Watch Timelines Split | The God of Time",
  description:
    "Change one historical event and navigate three diverging futures at a time. Watch alternate timelines branch on a live canvas tree.",
  keywords: [
    "butterfly effect",
    "alternate history",
    "what if",
    "timeline branching",
    "history simulator",
    "AI alternate history",
  ],
  openGraph: {
    title: "Butterfly Effect | The God of Time",
    description:
      "Alter history. Navigate diverging timelines. Watch the butterfly effect unfold.",
    url: "https://thegodoftime.com/realms/butterfly-effect",
  },
  alternates: {
    canonical: "https://thegodoftime.com/realms/butterfly-effect",
  },
};

export default function ButterflyEffectPage() {
  return <ButterflyEffect />;
}
