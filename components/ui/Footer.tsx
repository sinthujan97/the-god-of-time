import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-brutal w-full py-6 mt-auto text-center text-text-muted text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span>© {new Date().getFullYear()} </span>
          <span className="font-headline tracking-tight uppercase font-black text-text-primary">✦ God of Time</span>
          <span>. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/tools" className="hover:text-text-primary transition-colors">
            Utility Tools
          </Link>
          <Link href="/realms" className="hover:text-text-primary transition-colors">
            Fun Realms
          </Link>
          <span className="opacity-40" aria-hidden="true">|</span>
          <Link href="/about" className="hover:text-text-primary transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-text-primary transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-text-primary transition-colors">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-text-primary transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
