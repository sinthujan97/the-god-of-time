import CosmicBodyClock from "@/components/realms/experiences/CosmicBodyClock";

export const metadata = {
  title: "Cosmic Body Clock | Live Body Stats Since Birth | The God of Time",
  description:
    "Enter your birthdate and watch every biological counter tick live — heartbeats since birth, breaths taken, times blinked, years spent asleep, and when today's memories will fade.",
  keywords: [
    "body clock",
    "heartbeat counter",
    "life stats",
    "ebbinghaus forgetting curve",
    "sleep calculator",
    "biological age",
    "body statistics",
  ],
  openGraph: {
    title: "Cosmic Body Clock | The God of Time",
    description:
      "Watch every biological counter tick live since the moment you were born.",
    url: "https://thegodoftime.com/realms/cosmic-body-clock",
  },
  alternates: {
    canonical: "https://thegodoftime.com/realms/cosmic-body-clock",
  },
};

export default function CosmicBodyClockPage() {
  return <CosmicBodyClock />;
}
