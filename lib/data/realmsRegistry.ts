export type Realm = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  accent: string;
  needsAI: boolean;
  seo: {
    introText: string;
    howToTitle: string;
    howToSteps: string[];
    useCases?: { title: string; content: string }[];
    faqs: { question: string; answer: string }[];
  };
};

export const realmsRegistry: Realm[] = [
  {
    id: "paint-dry-simulator",
    slug: "paint-dry-simulator",
    name: "Paint Dry Simulator",
    description:
      "Watch paint dry in real time. Absurdist messages appear as the paint dries. Scientifically accurate. Completely pointless. Deeply satisfying.",
    category: "whimsical",
    accent: "#A8CC1C",
    needsAI: false,
    seo: {
      introText:
        "The Paint Dry Simulator tracks a real 4-hour paint drying cycle with scientific precision and absolutely no practical purpose. Watch polymer chains cross-link in real time while absurdist messages remind you of the choices that led you here.",
      howToTitle: "How to Watch Paint Dry",
      howToSteps: [
        "The paint starts wet when you arrive. It will take exactly 4 hours of real clock time to dry completely. Your progress is saved in your browser so you can leave and return.",
        "Absurdist messages appear at milestone percentages — 5%, 10%, 25%, 50%, and so on. Each one is a meditation on time, meaning, and latex paint.",
        "Adjust the room temperature slider to change the drying speed. Warmer rooms dry faster. This is the only control you have. Use it wisely.",
      ],
      faqs: [
        {
          question: "Does the paint drying actually take 4 real hours?",
          answer:
            "Yes. The timer runs on actual clock time and persists across page refreshes using your browser session. At room temperature (21°C) latex paint takes 1-4 hours to dry to touch — this simulator uses the realistic end of that range.",
        },
        {
          question: "What happens when the paint is fully dry?",
          answer:
            "A completion message appears and a Paint Again button resets the canvas with a new random color. Your previous drying session is cleared and the cycle begins again.",
        },
        {
          question: "Can I speed up the drying?",
          answer:
            "Yes. Use the room temperature slider in the controls below the canvas. Higher temperatures reduce drying time. This is scientifically accurate — warmer air increases solvent evaporation rate in latex paint.",
        },
        {
          question: "Why does this exist?",
          answer:
            "Time is finite. Most of it is spent on things of uncertain significance. The Paint Dry Simulator makes that visible. Also it is funny.",
        },
      ],
    },
  },
  {
    id: "solar-system-age",
    slug: "solar-system-age",
    name: "Solar System Age",
    description:
      "Enter your birth date and discover how old you are on every planet in the solar system — then see just how vanishingly small your existence looks from a galactic scale.",
    category: "cosmos",
    accent: "#C5F135",
    needsAI: false,
    seo: {
      introText:
        "The Solar System Age calculator converts your Earth age into planetary years across all eight planets. You may be over 100 Mercury years old, barely one Saturn year old, and have completed an almost imperceptibly tiny fraction of a galactic year.",
      howToTitle: "How to Calculate Your Planetary Age",
      howToSteps: [
        "Enter your date of birth in the input field. The calculator accepts any date from 1900 to today.",
        "Click Reveal My Cosmic Age to instantly see your age in Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune years.",
        "Scroll down for galactic and cosmic perspective — your age as a fraction of the universe's life, light-years traveled with the Sun through the galaxy, and more.",
      ],
      faqs: [
        {
          question: "How is my planetary age calculated?",
          answer:
            "Each planet has a different orbital period — the time it takes to complete one full orbit around the Sun. Your age in Earth years is divided by that planet's orbital period to give your age in that planet's years. Mercury's period is 0.24 Earth years; Neptune's is 164.8 Earth years.",
        },
        {
          question: "Am I really over 100 years old on Mercury?",
          answer:
            "Yes. Mercury orbits the Sun in just 88 Earth days — about 0.24 Earth years. A 25-year-old has lived through roughly 104 Mercury years. A 1-year-old baby has already celebrated over 4 Mercury birthdays.",
        },
        {
          question: "What does the galactic year calculation mean?",
          answer:
            "The Sun takes approximately 225 million Earth years to complete one orbit around the Milky Way's centre — called a galactic year or cosmic year. Even a 100-year-old human has completed less than 0.00000045% of one galactic year.",
        },
        {
          question: "How far have I traveled through space?",
          answer:
            "The Sun moves at roughly 251 km/s through the galaxy, carrying Earth — and you — along with it. A 30-year-old has traveled approximately 25 light-years through the galaxy since birth. That is the distance light takes 25 years to cross.",
        },
      ],
    },
  },
  {
    id: "absurd-clocks",
    slug: "absurd-clocks",
    name: "Absurd Clocks",
    description:
      "Watch paint dry in real time. Absurdist messages appear as the paint dries. Scientifically accurate. Completely pointless. Deeply satisfying.",
    category: "whimsical",
    accent: "#A8CC1C",
    needsAI: false,
    seo: {
      introText:
        "The Paint Dry Simulator tracks a real 4-hour paint drying cycle with scientific precision and absolutely no practical purpose. Watch polymer chains cross-link in real time while absurdist messages remind you of the choices that led you here.",
      howToTitle: "How to Watch Paint Dry",
      howToSteps: [
        "The paint starts wet when you arrive. It will take exactly 4 hours of real clock time to dry completely. Your progress is saved in your browser so you can leave and return.",
        "Absurdist messages appear at milestone percentages — 5%, 10%, 25%, 50%, and so on. Each one is a meditation on time, meaning, and latex paint.",
        "Adjust the room temperature slider to change the drying speed. Warmer rooms dry faster. This is the only control you have. Use it wisely.",
      ],
      faqs: [
        {
          question: "Does the paint drying actually take 4 real hours?",
          answer:
            "Yes. The timer runs on actual clock time and persists across page refreshes using your browser session. At room temperature (21°C) latex paint takes 1-4 hours to dry to touch — this simulator uses the realistic end of that range.",
        },
        {
          question: "What happens when the paint is fully dry?",
          answer:
            "A completion message appears and a Paint Again button resets the canvas with a new random color. Your previous drying session is cleared and the cycle begins again.",
        },
        {
          question: "Can I speed up the drying?",
          answer:
            "Yes. Use the room temperature slider in the controls below the canvas. Higher temperatures reduce drying time. This is scientifically accurate — warmer air increases solvent evaporation rate in latex paint.",
        },
        {
          question: "Why does this exist?",
          answer:
            "Time is finite. Most of it is spent on things of uncertain significance. The Paint Dry Simulator makes that visible. Also it is funny.",
        },
      ],
    },
  },
];
