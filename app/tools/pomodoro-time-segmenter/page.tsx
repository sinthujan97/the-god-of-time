import React from "react";
import { Metadata } from "next";
import { pomodoroTimeSegmenterData } from "@/lib/tools/data/pomodoro-time-segmenter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import PomodoroTimeSegmenterInputs from "@/components/tools/inputs/PomodoroTimeSegmenterInputs";

export const metadata: Metadata = {
  title: pomodoroTimeSegmenterData.seo.title,
  description: pomodoroTimeSegmenterData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${pomodoroTimeSegmenterData.slug}`,
  },
  openGraph: {
    title: pomodoroTimeSegmenterData.seo.title,
    description: pomodoroTimeSegmenterData.seo.metaDescription,
    url: `/tools/${pomodoroTimeSegmenterData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={pomodoroTimeSegmenterData}
      InputsComponent={PomodoroTimeSegmenterInputs}
    />
  );
}
