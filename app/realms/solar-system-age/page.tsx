import React from "react";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import SolarSystemAge from "@/components/realms/experiences/SolarSystemAge";

const realm = realmsRegistry.find(r => r.slug === "solar-system-age")!;

export const metadata = {
  title: "Solar System Age | How Old Are You on Every Planet | The God of Time",
  description: realm.description,
  keywords: [
    "planetary age calculator",
    "how old am i on other planets",
    "solar system age",
    "age on mars",
    "age on jupiter",
    "galactic age",
    "cosmic age calculator",
  ],
  openGraph: {
    title: "Solar System Age | The God of Time",
    description: realm.description,
    url: "https://thegodoftime.com/realms/solar-system-age",
  },
  alternates: {
    canonical: "https://thegodoftime.com/realms/solar-system-age",
  },
};

export default function SolarSystemAgePage() {
  return <SolarSystemAge />;
}
