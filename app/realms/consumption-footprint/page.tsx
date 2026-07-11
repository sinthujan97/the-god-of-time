import ConsumptionFootprint from "@/components/realms/experiences/ConsumptionFootprint";

export const metadata = {
  title: "Consumption Footprint | Your Lifetime in Garbage Trucks & Plastic | The God of Time",
  description: "Enter your age and see your lifetime consumption as physical equivalents — plastic bottles, garbage trucks, bread loaves, water pools. Scale without guilt.",
  openGraph: { title: "Consumption Footprint | The God of Time", url: "/realms/consumption-footprint" },
  alternates: { canonical: "/realms/consumption-footprint" },
};

export default function ConsumptionFootprintPage() {
  return <ConsumptionFootprint />;
}
