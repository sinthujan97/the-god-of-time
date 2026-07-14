import { clocksRegistry } from "@/lib/data/clocksRegistry";
import { toolsRegistry } from "@/lib/data/toolsRegistry";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { gamesRegistry } from "@/lib/data/gamesRegistry";
import { SITE_URL } from "@/lib/constants";

// Generated at request time from the same registries that drive routing and
// the sitemap, so this can never drift out of sync with the live site.
export async function GET() {
  const lines: string[] = [];

  lines.push("# The God of Time");
  lines.push("");
  lines.push(
    "> A free hub of 100+ precision time and date calculators, clocks, cosmic \"realms,\" and daily games. No signup, no accounts, no cost — every tool runs entirely in the browser."
  );
  lines.push("");
  lines.push(
    `Legal and contact information: [About](${SITE_URL}/about), [Privacy Policy](${SITE_URL}/privacy), [Terms of Service](${SITE_URL}/terms), [Contact](${SITE_URL}/contact).`
  );
  lines.push("");

  lines.push("## Utility Tools");
  lines.push("");
  for (const group of toolsRegistry) {
    for (const tool of group.tools) {
      lines.push(`- [${tool.name}](${SITE_URL}/tools/${tool.slug}): ${tool.description}`);
    }
  }
  lines.push("");

  lines.push("## Clocks");
  lines.push("");
  for (const clock of clocksRegistry) {
    // Clocks marked isExistingTool are really tools pages, already listed above.
    if (clock.isExistingTool) continue;
    lines.push(`- [${clock.name}](${SITE_URL}/clocks/${clock.slug}): ${clock.description}`);
  }
  lines.push("");

  lines.push("## Fun Realms");
  lines.push("");
  for (const realm of realmsRegistry) {
    lines.push(`- [${realm.name}](${SITE_URL}/realms/${realm.slug}): ${realm.description}`);
  }
  lines.push("");

  lines.push("## Games");
  lines.push("");
  for (const game of gamesRegistry) {
    lines.push(`- [${game.name}](${SITE_URL}/games/${game.slug}): ${game.description}`);
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
