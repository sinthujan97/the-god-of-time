import FictionalFutures from "@/components/realms/experiences/FictionalFutures";

export const metadata = {
  title: "Fictional Futures Countdown | Sci-Fi Years Passed & Coming | The God of Time",
  description:
    "Every sci-fi future year we've already lived through — vs the ones still coming. Blade Runner 2049. Minority Report 2054. Star Trek 2063. How close are we?",
  keywords: [
    "fictional futures",
    "sci-fi predictions",
    "blade runner 2049",
    "back to the future",
    "minority report",
    "science fiction timeline",
    "future countdown",
  ],
  openGraph: {
    title: "Fictional Futures Countdown | The God of Time",
    description:
      "We've already lived through Skynet, The Matrix, and Blade Runner 2019. See what fictional futures are still ahead.",
    url: "/realms/fictional-futures",
  },
  alternates: {
    canonical: "/realms/fictional-futures",
  },
};

export default function FictionalFuturesPage() {
  return <FictionalFutures />;
}
