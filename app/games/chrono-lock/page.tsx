import React from "react";
import type { Metadata } from "next";
import ChronoLock from "@/components/games/ChronoLock";

export const metadata: Metadata = {
  title: "Chrono Vault | Freeze the Clock | The God of Time",
  description:
    "A daily precision timing game. Freeze a running combination vault at the target time — unit by unit. Miss the hour and you lose your entire collection.",
  openGraph: {
    title: "Chrono Vault | The God of Time",
    description: "One shot per day. Freeze the combination. Don't miss the hour.",
    url: "/games/chrono-lock",
  },
  alternates: {
    canonical: "/games/chrono-lock",
  },
};

export default function ChronoLockPage() {
  return <ChronoLock />;
}
