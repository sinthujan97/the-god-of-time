import SolarSystemOrrery from "@/components/realms/experiences/SolarSystemOrrery";

export const metadata = {
  title: "Solar System Live Orrery | Real Planetary Positions | The God of Time",
  description: "A live animated solar system showing the real current positions of all 8 planets computed from Keplerian orbital mechanics. Mars Sol clock, solar cycle, planetary alignment calculator.",
  openGraph: { title: "Solar System Live Orrery | The God of Time", url: "https://thegodoftime.com/realms/solar-system-orrery" },
  alternates: { canonical: "https://thegodoftime.com/realms/solar-system-orrery" },
};

export default function SolarSystemOrreryPage() {
  return <SolarSystemOrrery />;
}
