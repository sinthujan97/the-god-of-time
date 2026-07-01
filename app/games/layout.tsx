import React from "react";
import { SectionAccentProvider } from "@/lib/context/SectionAccentContext";

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionAccentProvider section="games">
      {children}
    </SectionAccentProvider>
  );
}
