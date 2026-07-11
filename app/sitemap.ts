import type { MetadataRoute } from "next";
import { clocksRegistry } from "@/lib/data/clocksRegistry";
import { toolsRegistry } from "@/lib/data/toolsRegistry";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { gamesRegistry } from "@/lib/data/gamesRegistry";

const BASE_URL = "https://thegodoftime.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/tools",
    "/clocks",
    "/realms",
    "/games",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
  }));

  // Clocks that are really tools pages (isExistingTool) are covered by the
  // tools loop below via existingToolSlug — skip them here to avoid duplicates.
  const clockRoutes = clocksRegistry
    .filter((c) => !c.isExistingTool)
    .map((c) => ({ url: `${BASE_URL}/clocks/${c.slug}` }));

  const toolRoutes = toolsRegistry
    .flatMap((g) => g.tools)
    .map((t) => ({ url: `${BASE_URL}/tools/${t.slug}` }));

  const realmRoutes = realmsRegistry.map((r) => ({ url: `${BASE_URL}/realms/${r.slug}` }));

  const gameRoutes = gamesRegistry.map((g) => ({ url: `${BASE_URL}/games/${g.slug}` }));

  return [...staticRoutes, ...clockRoutes, ...toolRoutes, ...realmRoutes, ...gameRoutes];
}
