"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import FullscreenButton from "./FullscreenButton";

interface FullscreenWrapperProps {
  children: ReactNode;
  clockName: string;
}

export default function FullscreenWrapper({ children }: FullscreenWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
      const el = contentRef.current;
      if (!el) {
        const scaleH = (h / 380) * 0.85;
        const scaleW = (w / 450) * 0.85;
        const bestScale = Math.max(1.0, Math.min(6, Math.min(scaleH, scaleW)));
        setScaleFactor(bestScale);
        return;
      }

      // Temporarily clear the scale transform AND the forced 100% width so
      // scrollWidth reflects the content's true (shrink-to-fit) size rather
      // than the width of the surrounding column — otherwise narrow content
      // (e.g. a small clock face centered in a wide column) gets bottlenecked
      // by the column width and never reaches its real available scale.
      const prevTransform = el.style.transform;
      const prevWidth = el.style.width;
      el.style.transform = "none";
      el.style.width = "fit-content";
      el.style.maxWidth = "none";
      const contentW = el.scrollWidth || 450;
      const contentH = el.scrollHeight || 380;
      el.style.width = prevWidth;
      el.style.transform = prevTransform;

      // Compute scale to fit inside 90% of screen size (margin), uncapped aside from a sanity ceiling
      const scaleH = (h / contentH) * 0.90;
      const scaleW = (w / contentW) * 0.90;
      const bestScale = Math.max(1.0, Math.min(6, Math.min(scaleH, scaleW)));
      setScaleFactor(bestScale);
    };

    handleResize();
    const t = setTimeout(handleResize, 50);

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", handleResize);
    };
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
        ref={contentRef}
        style={{
          width: "100%",
          transform: activeFs ? `scale(${scaleFactor})` : "none",
          transformOrigin: "center center",
          transition: "transform 0.15s ease-out",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
      <FullscreenButton isFs={activeFs} onToggle={toggleFs} />
    </div>
  );
}
