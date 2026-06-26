"use client";

import React, { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/realms/physics";

interface AIResultRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export default function AIResultReveal({ children, delay = 0 }: AIResultRevealProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => {
      setRevealed(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (typeof window !== "undefined" && prefersReducedMotion()) {
    return <div style={{ width: "100%" }}>{children}</div>;
  }

  return (
    <div
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
