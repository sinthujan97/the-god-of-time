export type Realm = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  accent: string;
  needsAI: boolean;
};

export const realmsRegistry: Realm[] = [
  // needsAI: false (Cosmic and Physics Simulators)
  {
    id: "solar-system-age",
    slug: "solar-system-age",
    name: "Solar System Age Dashboard",
    description: "Visualize elapsed celestial time and planetary orbits since the birth of our Sun.",
    category: "cosmos",
    accent: "#4B8EF1", // --accent-cosmos
    needsAI: false
  },
  {
    id: "cosmic-countdown",
    slug: "cosmic-countdown",
    name: "Cosmic Countdown Console",
    description: "Watch the countdown to the heat death of the universe and other stellar end-state events.",
    category: "cosmos",
    accent: "#4B8EF1", // --accent-cosmos
    needsAI: false
  },
  {
    id: "relativistic-travel",
    slug: "relativistic-travel",
    name: "Relativistic Travel Suite",
    description: "Calculate dilation metrics for journeying to stars near the speed of light.",
    category: "cosmos",
    accent: "#4B8EF1", // --accent-cosmos
    needsAI: false
  },
  {
    id: "body-in-numbers",
    slug: "body-in-numbers",
    name: "Your Body in Numbers",
    description: "Discover your biological clocks: heartbeats, breaths, and cell divisions in your lifetime.",
    category: "biology",
    accent: "#C9A84C", // --accent-bio
    needsAI: false
  },
  {
    id: "deep-time-context",
    slug: "deep-time-context",
    name: "Deep Time Life Context",
    description: "Compare your human lifespan against the vast epochs of geological and universal time.",
    category: "cosmos",
    accent: "#4B8EF1", // --accent-cosmos
    needsAI: false
  },
  {
    id: "black-hole-gravity",
    slug: "black-hole-gravity",
    name: "Black Hole Gravity Playground",
    description: "Enter the event horizon to calculate extreme gravitational time dilation fields.",
    category: "physics",
    accent: "#4B8EF1", // --accent-cosmos (Physics Playground)
    needsAI: false
  },
  {
    id: "spacetime-fabric",
    slug: "spacetime-fabric",
    name: "Spacetime Fabric Grid",
    description: "Interact with a virtual gravity well warping light cones and temporal lines.",
    category: "physics",
    accent: "#4B8EF1", // --accent-cosmos
    needsAI: false
  },
  {
    id: "wormhole-portal",
    slug: "wormhole-portal",
    name: "Wormhole Portal",
    description: "Bridge two distinct temporal points and model the causality constraint curves.",
    category: "physics",
    accent: "#4B8EF1", // --accent-cosmos
    needsAI: false
  },
  {
    id: "time-dilation-slider",
    slug: "time-dilation-slider",
    name: "Time Dilation Slider",
    description: "Adjust travel velocity to instantly compare aging rates between a traveler and observer.",
    category: "physics",
    accent: "#4B8EF1", // --accent-cosmos
    needsAI: false
  },
  {
    id: "planet-billiards",
    slug: "planet-billiards",
    name: "Planet Billiards",
    description: "Simulate orbital gravitational slingshots and watch time distort across orbits.",
    category: "physics",
    accent: "#4B8EF1", // --accent-cosmos
    needsAI: false
  },

  // needsAI: true (Generative / Paradox Realms)
  {
    id: "what-year-am-i",
    slug: "what-year-am-i",
    name: "What Year Am I In?",
    description: "Input clues or answer cryptic questions to let AI determine which temporal era you're trapped in.",
    category: "scifi",
    accent: "#7B61FF", // --accent-scifi
    needsAI: true
  },
  {
    id: "butterfly-effect",
    slug: "butterfly-effect",
    name: "Butterfly Effect Calculator",
    description: "Change a minute past action and let AI generate the cascading timeline deviations.",
    category: "scifi",
    accent: "#7B61FF", // --accent-scifi
    needsAI: true
  },
  {
    id: "born-wrong-era",
    slug: "born-wrong-era",
    name: "Born Too Late/Early Matrix",
    description: "Describe your tastes to map your personality into your true cosmic historical epoch.",
    category: "whimsical",
    accent: "#3ABFBF", // --accent-whim
    needsAI: true
  },
  {
    id: "genius-age-matcher",
    slug: "genius-age-matcher",
    name: "Famous Genius Age Matcher",
    description: "Compare your age accomplishments to historical giants and receive motivational AI insight.",
    category: "biology",
    accent: "#C9A84C", // --accent-bio
    needsAI: true
  },
  {
    id: "quantum-leap",
    slug: "quantum-leap",
    name: "Quantum Leap Destination",
    description: "Jump blindly into the temporal stream and receive an AI log of your new identity.",
    category: "scifi",
    accent: "#7B61FF", // --accent-scifi
    needsAI: true
  },
  {
    id: "retrocausality",
    slug: "retrocausality",
    name: "Retrocausality Engine",
    description: "Send messages backward in time to see how they retroactively rewrite your AI profile.",
    category: "scifi",
    accent: "#7B61FF", // --accent-scifi
    needsAI: true
  },
  {
    id: "alternate-history",
    slug: "alternate-history",
    name: "Alternate History Animator",
    description: "Merge two historical periods and let AI narrate the resulting hybrid civilization.",
    category: "scifi",
    accent: "#7B61FF", // --accent-scifi
    needsAI: true
  },
  {
    id: "destiny-matrix",
    slug: "destiny-matrix",
    name: "God of Time Destiny Matrix",
    description: "Read your alignment under the shifting celestial chronometers and unlock your temporal path.",
    category: "destiny",
    accent: "#E09A3A", // --accent-destiny
    needsAI: true
  }
];
