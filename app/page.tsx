import React from "react";
import { Metadata } from "next";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturedToolsStrip from "@/components/homepage/FeaturedToolsStrip";
import RealmsSection from "@/components/homepage/RealmsSection";
import TransitionDivider from "@/components/homepage/TransitionDivider";
import UtilitySection from "@/components/homepage/UtilitySection";
import HomepageFooter from "@/components/homepage/HomepageFooter";

export const metadata: Metadata = {
  title: "The God of Time | Cosmic Time Tools & Calculators",
  description: "Explore 100 precision time calculators and immersive cosmic experiences. From business day counters to black hole gravity playgrounds — every second counts.",
  openGraph: {
    title: "The God of Time",
    description: "100 precision time tools and immersive cosmic experiences.",
    url: "https://thegodoftime.com",
    siteName: "The God of Time",
    type: "website"
  }
};

export default function Home() {
  return (
    <main className="w-full relative overflow-x-hidden">
      {/* 1. Hero Section (full viewport height) */}
      <HeroSection />

      {/* 2. Featured Tools Strip */}
      <FeaturedToolsStrip />

      {/* 3. Cosmic Realms grid */}
      <RealmsSection />

      {/* 4. Tonal Transition Divider */}
      <TransitionDivider />

      {/* 5. Utility Calculators tabs grid */}
      <UtilitySection />

      {/* 6. Homepage branding footer */}
      <HomepageFooter />
    </main>
  );
}
