"use client";

import React from "react";
import dynamic from "next/dynamic";
import RealmLoadingState from "./RealmLoadingState";
import RealmComingSoon from "./RealmComingSoon";
import RealmTransition from "./RealmTransition";

const REALM_COMPONENTS: Record<string, React.ComponentType> = {
  "solar-system-age": dynamic(
    () => import("./experiences/SolarSystemAge"),
    { loading: () => <RealmLoadingState /> }
  ),
  "black-hole-gravity": dynamic(
    () => import("./experiences/BlackHoleGravity"),
    { loading: () => <RealmLoadingState /> }
  ),
  "what-year-am-i": dynamic(
    () => import("./experiences/WhatYearAmI"),
    { loading: () => <RealmLoadingState /> }
  ),
  "butterfly-effect": dynamic(
    () => import("./experiences/ButterflyEffect"),
    { loading: () => <RealmLoadingState /> }
  ),
  "spacetime-fabric": dynamic(
    () => import("./experiences/SpacetimeFabric"),
    { loading: () => <RealmLoadingState /> }
  ),
  "born-wrong-era": dynamic(
    () => import("./experiences/BornWrongEra"),
    { loading: () => <RealmLoadingState /> }
  ),
  "destiny-matrix": dynamic(
    () => import("./experiences/DestinyMatrix"),
    { loading: () => <RealmLoadingState /> }
  ),
  "cosmic-countdown": dynamic(
    () => import("./experiences/CosmicCountdown"),
    { loading: () => <RealmLoadingState /> }
  ),
  "relativistic-travel": dynamic(
    () => import("./experiences/RelativisticTravel"),
    { loading: () => <RealmLoadingState /> }
  ),
  "body-in-numbers": dynamic(
    () => import("./experiences/BodyInNumbers"),
    { loading: () => <RealmLoadingState /> }
  ),
  "deep-time-context": dynamic(
    () => import("./experiences/DeepTimeContext"),
    { loading: () => <RealmLoadingState /> }
  ),
  "planet-billiards": dynamic(
    () => import("./experiences/PlanetBilliards"),
    { loading: () => <RealmLoadingState /> }
  ),
  "time-dilation-slider": dynamic(
    () => import("./experiences/TimeDilationSlider"),
    { loading: () => <RealmLoadingState /> }
  ),
  "genius-age-matcher": dynamic(
    () => import("./experiences/GeniusAgeMatcher"),
    { loading: () => <RealmLoadingState /> }
  ),
  "quantum-leap": dynamic(
    () => import("./experiences/QuantumLeap"),
    { loading: () => <RealmLoadingState /> }
  ),
  "retrocausality": dynamic(
    () => import("./experiences/Retrocausality"),
    { loading: () => <RealmLoadingState /> }
  ),
  "alternate-history": dynamic(
    () => import("./experiences/AlternateHistory"),
    { loading: () => <RealmLoadingState /> }
  ),
  "wormhole-portal": dynamic(
    () => import("./experiences/WormholePortal"),
    { loading: () => <RealmLoadingState /> }
  ),
  "cosmic-personal-stats": dynamic(
    () => import("./experiences/CosmicPersonalStats"),
    { loading: () => <RealmLoadingState /> }
  ),
  "life-mosaic": dynamic(
    () => import("./experiences/LifeMosaic"),
    { loading: () => <RealmLoadingState /> }
  ),
  "time-wasters": dynamic(
    () => import("./experiences/TimeWasters"),
    { loading: () => <RealmLoadingState /> }
  ),
  "absurd-clocks": dynamic(
    () => import("./experiences/AbsurdClocks"),
    { loading: () => <RealmLoadingState /> }
  ),
  "cosmic-horror": dynamic(
    () => import("./experiences/CosmicHorror"),
    { loading: () => <RealmLoadingState /> }
  ),
  "time-paradox": dynamic(
    () => import("./experiences/TimeParadox"),
    { loading: () => <RealmLoadingState /> }
  ),
  "personal-time-machine": dynamic(
    () => import("./experiences/PersonalTimeMachine"),
    { loading: () => <RealmLoadingState /> }
  ),
};

interface RealmExperienceProps {
  slug: string;
  accentColor?: string;
}

export default function RealmExperience({ slug, accentColor }: RealmExperienceProps) {
  const ExperienceComponent = REALM_COMPONENTS[slug];

  if (!ExperienceComponent) {
    return <RealmComingSoon />;
  }

  return (
    <RealmTransition>
      <ExperienceComponent />
    </RealmTransition>
  );
}
