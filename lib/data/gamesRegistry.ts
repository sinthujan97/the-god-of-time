export type Game = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  difficulty: "easy" | "medium" | "hard" | "brutal";
  playTime: string;
  badges: string[];
  badgeEmojis: string[];
};

export const gamesRegistry: Game[] = [
  {
    id: "chrono-lock",
    slug: "chrono-lock",
    name: "Chrono Lock",
    tagline: "Freeze the clock. One shot.",
    description:
      "A daily precision timing challenge. Freeze a running clock at the exact target time — unit by unit. Miss the hour and you lose everything.",
    accent: "#C5F135",
    difficulty: "brutal",
    playTime: "~1 min",
    badges: ["Bronze", "Silver", "Gold", "Platinum"],
    badgeEmojis: ["🥉", "🥈", "🥇", "💎"],
  },
  {
    id: "temporal-anchor",
    slug: "temporal-anchor",
    name: "Temporal Anchor",
    tagline: "History is dissolving. Fire the anchor.",
    description:
      "A daily word game with a temporal twist. Letters loop through a quantum track — fire at the noise, spare the artifact. Four wrong shots collapse the timeline.",
    accent: "#B2D828",
    difficulty: "hard",
    playTime: "~2 min",
    badges: ["Timeline Restored", "Stable", "Fractured", "Collapsed"],
    badgeEmojis: ["✅", "💚", "⚠️", "💀"],
  },
  {
    id: "chronal-arborist",
    slug: "chronal-arborist",
    name: "Chronal Arborist",
    tagline: "Grow the Seed of Eons. Harvest history.",
    description:
      "A 10-minute roguelite. Solve chronological puzzles to grow an ancient tree through 10 stages. Reach the Golden Maturity to harvest Chronal Apples before the timeline collapses.",
    accent: "#A8CC1C",
    difficulty: "hard",
    playTime: "10 min",
    badges: ["Seedling", "Sapling", "Canopy", "Golden Orchard"],
    badgeEmojis: ["🌱", "🌿", "🌳", "🍎"],
  },
];
