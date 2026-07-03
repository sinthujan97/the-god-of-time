import RemainingExperiences from "@/components/realms/experiences/RemainingExperiences";

export const metadata = {
  title: "Remaining Experiences Counter | Christmases, Sunsets & More | The God of Time",
  description:
    "Enter your age and see how many Christmases, full moons, sunsets, Olympic Games, and haircuts you have left. Toggle between optimistic, average, and pessimistic life expectancy.",
  keywords: [
    "remaining experiences",
    "how many christmases left",
    "life countdown",
    "experiences remaining",
    "life expectancy calculator",
    "how many sunsets",
  ],
  openGraph: {
    title: "Remaining Experiences Counter | The God of Time",
    description:
      "How many Christmases, summers, and full moons do you have left? The numbers are oddly specific.",
    url: "https://thegodoftime.com/realms/remaining-experiences",
  },
  alternates: { canonical: "https://thegodoftime.com/realms/remaining-experiences" },
};

export default function RemainingExperiencesPage() {
  return <RemainingExperiences />;
}
