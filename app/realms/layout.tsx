import React from "react";
import { SectionAccentProvider } from "@/lib/context/SectionAccentContext";

export default function RealmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionAccentProvider section="realms">
      {children}
    </SectionAccentProvider>
  );
}
