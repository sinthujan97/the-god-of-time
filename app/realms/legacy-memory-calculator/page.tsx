import LegacyMemoryCalculator from "@/components/realms/experiences/LegacyMemoryCalculator";

export const metadata = {
  title: "Legacy & Memory Calculator | How Long Will You Exist? | The God of Time",
  description:
    "After you die, how long do you exist? A timeline from your death through your last spoken name, digital ghost, family memory, and DNA dissolution — 250 years out.",
  keywords: ["legacy calculator", "digital legacy", "how long remembered after death", "DNA dilution", "memory after death", "digital footprint after death"],
  openGraph: {
    title: "Legacy & Memory Calculator | The God of Time",
    description: "From your last spoken name to your DNA dissolving into the human gene pool — a timeline of your gradual disappearance.",
    url: "https://thegodoftime.com/realms/legacy-memory-calculator",
  },
  alternates: { canonical: "https://thegodoftime.com/realms/legacy-memory-calculator" },
};

export default function LegacyMemoryCalculatorPage() {
  return <LegacyMemoryCalculator />;
}
