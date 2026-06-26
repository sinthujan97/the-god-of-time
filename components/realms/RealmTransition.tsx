"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RealmTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (prefersReduced) { setVisible(true); return; }
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, [pathname, prefersReduced]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity: prefersReduced ? 1 : visible ? 1 : 0,
        transform: prefersReduced ? "none" : visible ? "scale(1)" : "scale(0.98)",
        transition: prefersReduced ? "none" : "opacity 400ms ease-out, transform 400ms ease-out",
      }}
    >
      {children}
    </div>
  );
}
