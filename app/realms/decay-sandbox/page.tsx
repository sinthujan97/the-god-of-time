import DecaySandbox from "@/components/realms/experiences/DecaySandbox";

export const metadata = {
  title: "Radioactive Decay Sandbox | Watch Atoms Decay in Real Time | The God of Time",
  description:
    "Pick a radioactive isotope and watch atoms decay probabilistically on a canvas. Carbon-14, Cesium-137, Polonium-210, Uranium-235 — real physics, accelerated.",
  keywords: [
    "radioactive decay",
    "half life simulator",
    "nuclear physics",
    "atom decay",
    "carbon 14",
    "radioactivity",
    "physics simulation",
  ],
  openGraph: {
    title: "Radioactive Decay Sandbox | The God of Time",
    description:
      "Watch atoms decay according to true quantum probability. Each flash is one nucleus disintegrating.",
    url: "https://thegodoftime.com/realms/decay-sandbox",
  },
  alternates: { canonical: "https://thegodoftime.com/realms/decay-sandbox" },
};

export default function DecaySandboxPage() {
  return <DecaySandbox />;
}
