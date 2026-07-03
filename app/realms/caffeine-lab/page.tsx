import CaffeineLab from "@/components/realms/experiences/CaffeineLab";

export const metadata = {
  title: "Caffeine & Metabolism Lab | Live Caffeine Decay Curve | The God of Time",
  description:
    "Log your coffee, tea, and energy drinks. Watch your caffeine level decay in real time based on the 5.7-hour half-life. See exactly when you can sleep.",
  keywords: [
    "caffeine calculator",
    "caffeine half life",
    "coffee metabolism",
    "when can i sleep",
    "caffeine decay",
    "energy drink tracker",
  ],
  openGraph: {
    title: "Caffeine & Metabolism Lab | The God of Time",
    description: "Log your drinks. Watch your caffeine drop. Know when you can sleep.",
    url: "https://thegodoftime.com/realms/caffeine-lab",
  },
  alternates: { canonical: "https://thegodoftime.com/realms/caffeine-lab" },
};

export default function CaffeineLabPage() {
  return <CaffeineLab />;
}
