import React from "react";
import { notFound } from "next/navigation";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import RealmCanvas from "@/components/realms/RealmCanvas";

interface RealmPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return realmsRegistry.map((realm) => ({
    slug: realm.slug,
  }));
}

export default async function RealmPage({ params }: RealmPageProps) {
  const { slug } = await params;

  const realm = realmsRegistry.find((r) => r.slug === slug);

  if (!realm) {
    notFound();
  }

  // Map category code to user-friendly name
  const categoryNames: Record<string, string> = {
    cosmos: "Space & Cosmos",
    biology: "Biology & History",
    scifi: "Sci-Fi & Paradox",
    whimsical: "Whimsical & Absurd",
    destiny: "Personal Destiny",
    physics: "Physics Playground",
  };

  const friendlyCategory = categoryNames[realm.category] || realm.category;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-500">
      {/* Realm Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: realm.accent }}
            />
            <span className="text-xs font-sans uppercase tracking-wider text-text-muted font-medium">
              {friendlyCategory} Realm
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-medium text-text-primary tracking-wide mt-2">
            {realm.name}
          </h1>
          <p className="text-sm md:text-base text-text-muted mt-2 font-sans max-w-2xl leading-relaxed">
            {realm.description}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1.5 text-xs font-mono">
          <span className="text-text-muted">SYSTEM STATUS:</span>
          {realm.needsAI ? (
            <span className="px-2.5 py-0.5 rounded border border-accent-scifi/30 bg-accent-scifi/10 text-accent-scifi font-medium">
              NEEDS GEN-AI LOGIC
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded border border-accent-cosmos/30 bg-accent-cosmos/10 text-accent-cosmos font-medium">
              DETERMINISTIC SIMULATION
            </span>
          )}
        </div>
      </div>

      {/* Simulator canvas element */}
      <RealmCanvas realmName={realm.name} accent={realm.accent}>
        {realm.needsAI ? (
          <div className="text-center space-y-4 max-w-md mx-auto p-6 bg-bg-card border border-border-subtle rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-accent-scifi/15 text-accent-scifi rounded-full flex items-center justify-center mx-auto text-xl">
              🔮
            </div>
            <div>
              <p className="font-display text-text-primary text-base font-medium">
                Generative Temporal Matrix Required
              </p>
              <p className="font-sans text-xs text-text-muted mt-1 leading-relaxed">
                This realm operates using artificial intelligence to synthesize custom timelines, causal loops, or destiny readings. AI routing will be configured in subsequent steps.
              </p>
            </div>
          </div>
        ) : null}
      </RealmCanvas>

      {/* Realm specs table */}
      <div className="bg-bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-sans font-medium text-text-primary uppercase tracking-wider">
          Realm Specifications
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-sans">
          <div>
            <span className="text-text-muted block">Accent Theme</span>
            <span className="font-mono text-text-primary mt-0.5 block" style={{ color: realm.accent }}>
              {realm.accent}
            </span>
          </div>
          <div>
            <span className="text-text-muted block">System Engine</span>
            <span className="text-text-primary mt-0.5 block">
              {realm.needsAI ? "Generative LLM Core" : "Local WebGL/Canvas"}
            </span>
          </div>
          <div>
            <span className="text-text-muted block">Causality Check</span>
            <span className="text-text-primary mt-0.5 block">
              {realm.needsAI ? "Paradox Permitted" : "Strict Newton-Einstein"}
            </span>
          </div>
          <div>
            <span className="text-text-muted block">Timeline Node</span>
            <span className="font-mono text-text-primary mt-0.5 block">
              /{realm.slug}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
