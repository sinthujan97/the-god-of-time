"use client";

import { useState, useEffect } from "react";

export function useFullscreen(): boolean {
  const [isFs, setIsFs] = useState(false);
  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);
  return isFs;
}
