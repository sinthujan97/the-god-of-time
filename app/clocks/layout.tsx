import { SectionAccentProvider } from "@/lib/context/SectionAccentContext";

export default function ClocksLayout({ children }: { children: React.ReactNode }) {
  return (
    <SectionAccentProvider section="clocks">
      {children}
    </SectionAccentProvider>
  );
}
