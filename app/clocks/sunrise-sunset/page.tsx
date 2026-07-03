import type { Metadata } from "next";
import SunriseSunset from "@/components/clocks/experiences/SunriseSunset";

export const metadata: Metadata = {
  title: "Sunrise & Sunset | The God of Time",
  description: "Golden hour, blue hour, solar noon, and daylight remaining for any city. Based on your local time.",
  openGraph: {
    title: "Sunrise & Sunset | The God of Time",
    description: "Golden hour, blue hour, solar noon, and daylight remaining for any city.",
    url: "https://thegodoftime.com/clocks/sunrise-sunset",
  },
};

export default function SunriseSunsetPage() {
  return <SunriseSunset />;
}
