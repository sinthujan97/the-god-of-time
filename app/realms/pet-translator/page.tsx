import PetTranslator from "@/components/realms/experiences/PetTranslator";

export const metadata = {
  title: "Pet Age & Species Translator | Dog Years, Cat Years & Alien Lifespans | The God of Time",
  description:
    "Watch your dog or cat's clock run faster than yours. Live pet-time ticker, remaining life countdown, and your age translated into elf years, Vulcan years, and Asgardian time.",
  keywords: [
    "dog years calculator",
    "cat years calculator",
    "pet age",
    "animal lifespan",
    "tolkien elf age",
    "vulcan years",
    "pet time",
  ],
  openGraph: {
    title: "Pet Age & Species Translator | The God of Time",
    description:
      "Your dog's clock runs 6.6× faster than yours. Watch it tick live, and find out how old you'd be as a Tolkien elf.",
    url: "https://thegodoftime.com/realms/pet-translator",
  },
  alternates: {
    canonical: "https://thegodoftime.com/realms/pet-translator",
  },
};

export default function PetTranslatorPage() {
  return <PetTranslator />;
}
