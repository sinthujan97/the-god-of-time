import { ToolPageData } from "../toolPageData";

export const militaryTimeConverterData: ToolPageData = {
  slug: "military-time-converter",
  name: "Military Time Converter",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#F5A857",
  description: "Convert between 12-hour AM/PM formats and 24-hour military standards.",
  
  seo: {
    title: "Military Time Converter | 24-Hour Clock Translator",
    metaDescription: "Convert AM/PM standard time to 24-hour military time. Includes phonetic radio pronunciations and standard reading instructions.",
    introText: "The Military Time Converter translates standard 12-hour clock times into the 24-hour formats used by the armed forces, aviation, emergency services, and medical personnel. It also generates the phonetic pronunciations used in radio transmissions to prevent communication errors.",
    howToTitle: "How to Convert Military Time",
    howToSteps: [
      "Select your translation mode: Standard to Military, or Military to Standard.",
      "Enter the source time values in the designated input field.",
      "View the converted time block instantly in large display typography.",
      "Read the generated phonetic phrase to understand how to speak the military time out loud."
    ],
    useCases: [
      {
        title: "Medical Record Logging",
        content: "Translate patient shift timestamps to the 24-hour clinical charts to prevent AM/PM dose administration mistakes."
      },
      {
        title: "Emergency and Radio Dispatches",
        content: "Convert operations logs into spoken military terms for radio communication to emergency responder units."
      },
      {
        title: "Aviation and Flight Logbooks",
        content: "Record flight schedules and logbook entries in standard 24-hour format, which is the aviation industry standard."
      }
    ],
    internalLinksText: "To monitor aviation standard UTC, use the Zulu Time Coordinator. To synchronize global delivery deadlines, use the Cross-Border Deadline Matcher.",
    relatedToolSlugs: [
      "zulu-time-coordinator",
      "cross-border-deadline",
      "world-time-converter"
    ],
    faqs: [
      {
        question: "Why does military time not use a colon?",
        answer: "In military and aviation protocols, colons are omitted (e.g. 0830 instead of 08:30) to create a clean, single 4-digit code that is quick to write and read."
      },
      {
        question: "How do you pronounce midnight in military time?",
        answer: "Midnight is expressed as 0000 hours, spoken phonetically as 'Zero Zero Zero Zero Hours', or occasionally as '2400' ('Twenty-Four Hundred Hours')."
      },
      {
        question: "What is the military phonetic alphabet context?",
        answer: "Phonetic numbers ensure clarity during poor radio signal transmissions, matching military protocols like NATO call conventions."
      }
    ]
  }
};
