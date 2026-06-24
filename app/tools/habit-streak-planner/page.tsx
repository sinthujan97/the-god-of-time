import React from "react";
import { Metadata } from "next";
import { habitStreakPlannerData } from "@/lib/tools/data/habit-streak-planner";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import HabitStreakPlannerInputs from "@/components/tools/inputs/HabitStreakPlannerInputs";

export const metadata: Metadata = {
  title: habitStreakPlannerData.seo.title,
  description: habitStreakPlannerData.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${habitStreakPlannerData.slug}`,
  },
  openGraph: {
    title: habitStreakPlannerData.seo.title,
    description: habitStreakPlannerData.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${habitStreakPlannerData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={habitStreakPlannerData}
      InputsComponent={HabitStreakPlannerInputs}
    />
  );
}
