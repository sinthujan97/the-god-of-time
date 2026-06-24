import { ToolPageData } from "../toolPageData";

export const vaccinationTrackerData: ToolPageData = {
  slug: "vaccination-tracker",
  name: "Vaccination Tracker Timeline",
  group: "health-lifecycle",
  groupName: "Health & Lifecycle",
  groupAccent: "#E87C7C",
  description: "Chart pediatric or travel immunization schedules based on birth date milestones.",
  
  seo: {
    title: "Vaccination Schedule Planner | Pediatric and Travel Immunizations Calendars",
    metaDescription: "Generate an accurate immunization compliance calendar schedule mapping medical target timelines from a baseline birth date.",
    introText: "The Vaccination Tracker Timeline translates a baseline birth date into a structured CDC/WHO-aligned immunization schedule. It calculates recommended targets for infants and children to ensure timely protection.",
    howToTitle: "How to Generate Schedules",
    howToSteps: [
      "Select the child's birth date using the calendar picker.",
      "Browse the timeline starting from birth through age 6.",
      "Check the specific vaccines recommended for each age milestone.",
      "Verify target dates with your pediatrician's appointment logs."
    ],
    useCases: [
      {
        title: "Infant Care Milestones",
        content: "Track complex vaccine series (e.g. DTaP, Rotavirus, PCV13) during the critical first year."
      },
      {
        title: "School Enrollment Compliance",
        content: "Audit kindergarten immunization requirements (such as MMR and Varicella booster doses)."
      },
      {
        title: "Medical Records Organization",
        content: "Maintain a clear checklist of completed and upcoming vaccines for pediatric files."
      }
    ],
    internalLinksText: "To calculate pregnancy trimesters, use the Trimester Milestone Calendar. To translate pet ages, try the Pet Age Translator.",
    relatedToolSlugs: [
      "trimester-calendar",
      "pet-age-translator",
      "age-calculator"
    ],
    faqs: [
      {
        question: "How are the vaccine milestones determined?",
        answer: "The calculator maps target dates according to standard CDC (Centers for Disease Control) and WHO guidelines for childhood immunization."
      },
      {
        question: "Can I use this for travel immunizations?",
        answer: "This tool generates childhood schedules. For international travel, consult a travel clinic at least 6 weeks before departure."
      },
      {
        question: "What is DTaP?",
        answer: "DTaP is a combination vaccine protecting infants from three bacterial diseases: Diphtheria, Tetanus, and Pertussis (whooping cough)."
      }
    ]
  }
};
