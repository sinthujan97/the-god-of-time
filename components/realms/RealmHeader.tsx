import { Realm } from "@/lib/data/realmsRegistry";

export function RealmHeader({ realm }: { realm: Realm }) {
  const CATEGORY_ACCENTS: Record<string, string> = {
    cosmos: "var(--accent-cosmos)",
    physics: "var(--accent-cosmos)",
    biology: "var(--accent-bio)",
    scifi: "var(--accent-scifi)",
    whimsical: "var(--accent-whim)",
    destiny: "var(--accent-destiny)",
  };

  const accentColor =
    CATEGORY_ACCENTS[realm.category] ?? "var(--accent-cosmos)";

  return (
    <div className="tool-header-block" style={{ marginBottom: "32px" }}>
      <div
        className="tool-header-accent-bar"
        style={{ background: realm.accent }}
      />
      <span
        className="tool-header-eyebrow"
        style={{ color: accentColor }}
      >
        {realm.category.toUpperCase()}
      </span>
      <h1 className="tool-header-h1">{realm.name}</h1>
      <p className="tool-header-description">{realm.description}</p>
    </div>
  );
}
