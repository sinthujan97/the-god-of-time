import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 pb-24 pt-6 text-center">
      <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-muted block mb-4">404</span>
      <h1 className="text-3xl md:text-4xl font-display font-light text-text-primary mb-4">This moment doesn't exist</h1>
      <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-10 max-w-xl mx-auto">
        The page you're looking for has either moved, been renamed, or never existed. Here's the rest of the site.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="card-brutal-static px-5 py-2.5 font-mono text-sm font-bold text-text-primary hover:text-text-primary transition-colors">
          Home
        </Link>
        <Link href="/tools" className="card-brutal-static px-5 py-2.5 font-mono text-sm font-bold text-text-primary hover:text-text-primary transition-colors">
          Utility Tools
        </Link>
        <Link href="/clocks" className="card-brutal-static px-5 py-2.5 font-mono text-sm font-bold text-text-primary hover:text-text-primary transition-colors">
          Clocks
        </Link>
        <Link href="/realms" className="card-brutal-static px-5 py-2.5 font-mono text-sm font-bold text-text-primary hover:text-text-primary transition-colors">
          Fun Realms
        </Link>
        <Link href="/games" className="card-brutal-static px-5 py-2.5 font-mono text-sm font-bold text-text-primary hover:text-text-primary transition-colors">
          Games
        </Link>
      </div>
    </div>
  );
}
