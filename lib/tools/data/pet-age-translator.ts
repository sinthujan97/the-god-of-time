import { ToolPageData } from "../toolPageData";

export const petAgeTranslatorData: ToolPageData = {
  slug: "pet-age-translator",
  name: "Pet Age Translator",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#B2D828",
  description: "Convert dog, cat, or bird years to human years based on size and species guidelines.",
  
  seo: {
    title: "Pet Age Converter | Canine and Feline Biological Lifespans",
    metaDescription: "Convert animal calendar age logs into exact equivalent human biological aging parameters based on classification indexes.",
    introText: "The Pet Age Translator translates domestic pet calendar years into equivalent human biological age. Because pets mature much faster than humans in early life, this calculator utilizes breed size and species curves to provide accurate developmental stages.",
    howToTitle: "How to Translate Pet Ages",
    howToSteps: [
      "Select your pet type: Small Dog, Large Dog, Cat, or Bird.",
      "Input your pet's calendar age in years (decimal values are supported).",
      "Adjust the weight parameter if you have a large dog breed.",
      "Read the translated human age equivalent and the wellness recommendations."
    ],
    useCases: [
      {
        title: "Veterinary Care Alignment",
        content: "Check your pet's biological age category to schedule relevant tests, such as senior blood profiles."
      },
      {
        title: "Dietary Stage Adjustments",
        content: "Determine if your puppy or kitten has biologically transitioned to adulthood, requiring standard adult kibble."
      },
      {
        title: "Behavioral Expectation Checks",
        content: "Understand why an adolescent dog exhibits high energy, corresponding to a human teenager's developmental phase."
      }
    ],
    internalLinksText: "To measure your own high-resolution lifespan, use the Exact Age Calculator. To set family immunization targets, try the Vaccination Tracker Timeline.",
    relatedToolSlugs: [
      "age-calculator",
      "vaccination-tracker",
      "pregnancy-due-date-calculator"
    ],
    faqs: [
      {
        question: "Is one pet year always equal to seven human years?",
        answer: "No, that is an outdated simplification. Pets mature rapidly in their first two years (reaching a human equivalent of roughly 24), and then age slower, averaging 4 to 8 human years per calendar year thereafter."
      },
      {
        question: "How does weight affect dog aging?",
        answer: "Larger dog breeds age faster biologically and have shorter average lifespans than smaller breeds, requiring senior wellness care earlier in life."
      },
      {
        question: "How do birds age compared to mammals?",
        answer: "Many avian species mature rapidly in their first year but have extremely long lifespans, meaning their biological aging curve is relatively flat."
      }
    ]
  }
};
