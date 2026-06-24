import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto border-t border-border bg-bg-surface text-center text-text-muted text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span>© {new Date().getFullYear()} </span>
          <span className="font-display tracking-widest uppercase font-light">✦ God of Time</span>
          <span>. All rights reserved.</span>
        </div>
        <div className="flex gap-4">
          <Link href="/tools" className="hover:text-text-primary transition-colors">
            Utility Tools
          </Link>
          <Link href="/realms" className="hover:text-text-primary transition-colors">
            Fun Realms
          </Link>
        </div>
      </div>
    </footer>
  );
}
