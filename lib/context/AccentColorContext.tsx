"use client";

import React, { createContext, useContext } from "react";

const AccentColorContext = createContext<string>("#52C4A0");

export function AccentColorProvider({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <AccentColorContext.Provider value={color}>
      <div style={{ "--tool-accent": color } as React.CSSProperties}>
        {children}
      </div>
    </AccentColorContext.Provider>
  );
}

export function useAccentColor() {
  return useContext(AccentColorContext);
}
