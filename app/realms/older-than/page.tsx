import OlderThan from "@/components/realms/experiences/OlderThan";

export const metadata = {
  title: "You Are Older Than | Companies, Inventions & Sci-Fi Futures | The God of Time",
  description:
    "Enter your birthdate and see everything younger than you — Google, YouTube, the iPhone, ChatGPT, and every sci-fi future year you've already outlived.",
  keywords: [
    "older than",
    "age comparison",
    "things younger than me",
    "tech history",
    "sci-fi futures",
    "birthdate calculator",
  ],
  openGraph: {
    title: "You Are Older Than | The God of Time",
    description:
      "You are older than Google. Older than YouTube. Older than the iPhone. See everything younger than you.",
    url: "https://thegodoftime.com/realms/older-than",
  },
  alternates: {
    canonical: "https://thegodoftime.com/realms/older-than",
  },
};

export default function OlderThanPage() {
  return <OlderThan />;
}
