"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import FullscreenButton from "./FullscreenButton";

interface FullscreenWrapperProps {
  children: ReactNode;
  clockName: string;
}

export default function FullscreenWrapper({ children }: FullscreenWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFs, setIsFs] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1.5);

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    if (!isFs) return;
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scaleH = (h / 380) * 0.85; // Leave 15% padding vertically
      const scaleW = (w / 450) * 0.85; // Leave 15% padding horizontally
      const bestScale = Math.max(1.0, Math.min(2.2, Math.min(scaleH, scaleW)));
      setScaleFactor(bestScale);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isFs]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== "f") return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: isFs ? "100vh" : "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: isFs ? "var(--bg-base)" : "transparent",
      }}
    >
      <div
        style={{
          width: "100%",
          transform: isFs ? `scale(${scaleFactor})` : "none",
          transformOrigin: "center center",
          transition: "transform 0.15s ease-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
      <FullscreenButton targetRef={containerRef} />
    </div>
  );
}
