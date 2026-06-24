import { ToolPageData } from "../toolPageData";

export const alcoholClearanceData: ToolPageData = {
  slug: "alcohol-clearance",
  name: "Alcohol Metabolism Clearance Clock",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#E87C7C",
  description: "Estimate approximate time required for your system to metabolize alcohol intake based on standard Widmark BAC metrics.",
  
  seo: {
    title: "Alcohol Pricing Calculator | Estimated Blood Impairment Clearances",
    metaDescription: "Standardize general baseline clearance estimates tracking liver processing rates over time.",
    introText: "The Alcohol Metabolism Clearance Clock uses standard Widmark algorithms to estimate Blood Alcohol Concentration (BAC) and the clearance timeline required to reach sobriety. It provides an operational reference for understanding metabolic curves.",
    howToTitle: "How to Estimate Clearance",
    howToSteps: [
      "Select your biological sex and input your weight in pounds.",
      "Enter the total number of standard drinks consumed.",
      "Input the elapsed hours since you started drinking.",
      "Review the calculated BAC, countdown hours to zero, and safety status warnings."
    ],
    useCases: [
      {
        title: "Responsible Event Planning",
        content: "Understand how standard drinks accumulate in the body to schedule safe transportation options."
      },
      {
        title: "Next-Day Sobriety Checks",
        content: "Determine if alcohol consumed during the evening will be fully cleared before driving the next morning."
      },
      {
        title: "Metabolic Education Programs",
        content: "Demonstrate how biological sex, weight, and time variables impact alcohol retention curves."
      }
    ],
    internalLinksText: "To monitor nicotine cessation milestones, check the Nicotine Detox Health Timeline. To model caffeine half-lives, try the Caffeine Half Life Calculator.",
    relatedToolSlugs: [
      "nicotine-detox",
      "caffeine-half-life",
      "sleep-calculator"
    ],
    faqs: [
      {
        question: "What counts as a standard drink?",
        answer: "A standard drink contains exactly 14 grams of pure alcohol, which equates to 12 ounces of regular beer (5% ABV), 5 ounces of wine (12% ABV), or 1.5 ounces of distilled spirits (40% ABV)."
      },
      {
        question: "What is the average metabolism rate?",
        answer: "The human liver metabolizes alcohol at a constant average rate of approximately 0.015% BAC reduction per hour, regardless of sleep, coffee, or showers."
      },
      {
        question: "Why does biological sex alter BAC calculation?",
        answer: "Widmark formulas adjust for body water distributions. Females have a lower average body water percentage (r=0.55) than males (r=0.68), resulting in higher BAC concentrations for the same volume of alcohol."
      }
    ]
  }
};
