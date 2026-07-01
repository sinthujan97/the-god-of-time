import React from "react";
import { SectionAccentProvider } from "@/lib/context/SectionAccentContext";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionAccentProvider section="tools">
      {children}
    </SectionAccentProvider>
  );
}
