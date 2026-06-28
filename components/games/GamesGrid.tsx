import React from "react";
import { gamesRegistry } from "@/lib/data/gamesRegistry";
import GameCard from "./GameCard";

export default function GamesGrid() {
  return (
    <section className="w-full px-6 pb-24" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-5xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {gamesRegistry.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {gamesRegistry.length === 0 && (
          <p className="font-display font-light italic text-text-muted text-center py-20"
            style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}>
            More games arriving soon.
          </p>
        )}

      </div>
    </section>
  );
}
