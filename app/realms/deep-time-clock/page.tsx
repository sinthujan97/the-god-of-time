import DeepTimeClock from "@/components/realms/experiences/DeepTimeClock";

export const metadata = {
  title: "Deep Time Earth Clock | 4.5 Billion Years on a Clock Face | The God of Time",
  description: "A 24-hour clock where the full face represents 4.5 billion years. Humans appear at 11:58:43 PM. All recorded history fits in the last half-second.",
  openGraph: { title: "Deep Time Earth Clock | The God of Time", url: "/realms/deep-time-clock" },
  alternates: { canonical: "/realms/deep-time-clock" },
};

export default function DeepTimeClockPage() {
  return <DeepTimeClock />;
}
