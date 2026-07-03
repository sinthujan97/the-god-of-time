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
  const [isFallbackFs, setIsFallbackFs] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1.5);

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    document.addEventListener("mozfullscreenchange", handler);
    document.addEventListener("MSFullscreenChange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
      document.removeEventListener("mozfullscreenchange", handler);
      document.removeEventListener("MSFullscreenChange", handler);
    };
  }, []);

  const activeFs = isFs || isFallbackFs;

  useEffect(() => {
    if (!activeFs) return;
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
  }, [activeFs]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "escape" && isFallbackFs) {
        setIsFallbackFs(false);
      }
      if (e.key.toLowerCase() !== "f") return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      
      toggleFs();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isFallbackFs]);

  useEffect(() => {
    if (isFallbackFs) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFallbackFs]);

  const toggleFs = () => {
    const el = containerRef.current;
    if (!el) return;

    const hasRequestFs = !!(
      el.requestFullscreen ||
      (el as any).webkitRequestFullscreen ||
      (el as any).mozRequestFullScreen ||
      (el as any).msRequestFullscreen
    );

    if (hasRequestFs) {
      if (!document.fullscreenElement) {
        const req = (
          el.requestFullscreen ||
          (el as any).webkitRequestFullscreen ||
          (el as any).mozRequestFullScreen ||
          (el as any).msRequestFullscreen
        ).bind(el);
        req();
      } else {
        const exit = (
          document.exitFullscreen ||
          (document as any).webkitExitFullscreen ||
          (document as any).mozCancelFullScreen ||
          (document as any).msExitFullscreen
        ).bind(document);
        exit();
      }
    } else {
      setIsFallbackFs((prev) => !prev);
    }
  };

  return (
    <div
      ref={containerRef}
      style={
        isFallbackFs
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--bg-base)",
              zIndex: 9999,
            }
          : {
              position: "relative",
              width: "100%",
              height: isFs ? "100vh" : "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: isFs ? "var(--bg-base)" : "transparent",
            }
      }
    >
      <div
        style={{
          width: "100%",
          transform: activeFs ? `scale(${scaleFactor})` : "none",
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
      <FullscreenButton isFs={activeFs} onToggle={toggleFs} />
    </div>
  );
}
