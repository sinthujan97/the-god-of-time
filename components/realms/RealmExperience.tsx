"use client";

import React from "react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import RealmLoadingState from "./RealmLoadingState";
import RealmTransition from "./RealmTransition";

const PaintDrySimulator = dynamic(
  () => import("./experiences/PaintDrySimulator"),
  { loading: () => <RealmLoadingState /> }
);

const SolarSystemAge = dynamic(
  () => import("./experiences/SolarSystemAge"),
  { loading: () => <RealmLoadingState /> }
);

const REALM_COMPONENTS: Record<string, React.ComponentType> = {
  "paint-dry-simulator": PaintDrySimulator,
  "absurd-clocks": PaintDrySimulator,
  "solar-system-age": SolarSystemAge,
};

interface RealmExperienceProps {
  slug: string;
  accentColor?: string;
}

export default function RealmExperience({ slug, accentColor }: RealmExperienceProps) {
  const ExperienceComponent = REALM_COMPONENTS[slug];

  if (!ExperienceComponent) {
    redirect("/realms/paint-dry-simulator");
  }

  return (
    <RealmTransition>
      <ExperienceComponent />
    </RealmTransition>
  );
}
