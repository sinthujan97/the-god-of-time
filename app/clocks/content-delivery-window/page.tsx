import type { Metadata } from "next";
import ContentDeliveryAnalyzer from "@/components/clocks/experiences/ContentDeliveryAnalyzer";

export const metadata: Metadata = {
  title: "Content Delivery Window Analyzer | Social Media Peak Time | The God of Time",
  description: "Calculate the best time to post on social networks like X, LinkedIn, TikTok, and Instagram based on real-time timezone waking population densities.",
  openGraph: {
    title: "Content Delivery Window Analyzer | Social Media Peak Time | The God of Time",
    description: "Analyze attention density heat scores across the globe before you schedule posts.",
    url: "https://thegodoftime.com/clocks/content-delivery-window",
  },
};

export default function ContentDeliveryWindowPage() {
  return <ContentDeliveryAnalyzer />;
}
