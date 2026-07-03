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
      "Time measured in ways it was never meant to be measured. Dog years, geological eons, celebrity divorces, and the exact number of times your heart has beaten since breakfast.",
    category: "whimsical",
    accent: "#A8CC1C",
    needsAI: false,
    seo: {
      introText:
        "Absurd Clocks measures time in units that make perfect sense until you think about them. Watch paint dry, count heartbeats since your last meal, and discover that you are approximately 4,000 dog-weeks old.",
      howToTitle: "How to Use Absurd Clocks",
      howToSteps: [
        "Select a clock mode from the menu — paint drying, dog years, geological time, or one of the other absurd measurement systems.",
        "Watch the numbers accumulate in real time. Some counters tick every second. Others move so slowly the motion is philosophically meaningful.",
        "Share any reading with friends. Context helps. Context also ruins it.",
      ],
      faqs: [
        {
          question: "Are these measurements scientifically accurate?",
          answer:
            "Some are. The paint drying timer is based on actual latex paint evaporation rates. The heartbeat counter uses the average resting heart rate. The dog years conversion follows the non-linear AVMA formula. Others are clearly absurdist.",
        },
        {
          question: "Why would I want to know how many times I've blinked today?",
          answer:
            "You wouldn't. And yet here you are, already checking.",
        },
      ],
    },
  },
  {
    id: "fifth-dimension",
    slug: "fifth-dimension",
    name: "The 5th Dimension",
    description:
      "Map your life events as nodes in a 5th-dimensional tesseract. An AI oracle from parallel timelines sends signals about each moment.",
    category: "destiny",
    accent: "#5B7FFF",
    needsAI: true,
    seo: {
      introText:
        "The 5th Dimension lets you visualise your life as a constellation of interconnected moments. Each event becomes a node in a navigable 5D space — four spatial dimensions plus emotional resonance. Our AI oracle analyses the emotional signature of each moment and transmits what-if signals from alternate timelines.",
      howToTitle: "How to Navigate Your 5th Dimension",
      howToSteps: [
        "Enter 2–7 significant life events — give each a name, approximate date, and an emotional tag.",
        "Click \"Enter the 5th Dimension\" to generate your personal tesseract map.",
        "Drag to explore the space and discover how your events connect across dimensions.",
        "Click any event node to receive an AI signal from an alternate future where that moment unfolded differently.",
      ],
      faqs: [
        {
          question: "What is the 5th Dimension in this context?",
          answer:
            "We treat time as the 4th dimension and emotional resonance as the 5th. Your events are plotted at coordinates in this 5-dimensional space, revealing patterns invisible on a linear timeline.",
        },
        {
          question: "How does the AI signal work?",
          answer:
            "Each signal is generated by GPT-4o, acting as an oracle from a parallel timeline where your selected event unfolded differently. Signals are cached so each event is only processed once per session.",
        },
        {
          question: "Is my data saved?",
          answer:
            "No. All events exist only in your browser session. Nothing is stored on any server.",
        },
      ],
    },
  },
  {
    id: "butterfly-effect",
    slug: "butterfly-effect",
    name: "Butterfly Effect",
    description:
      "One historical change. Three diverging futures. Navigate alternate timelines and watch the butterfly effect ripple through history.",
    category: "scifi",
    accent: "#FF8C42",
    needsAI: true,
    seo: {
      introText:
        "The Butterfly Effect realm generates a pivotal historical event and asks you to alter it. Each choice fans into three new timelines — and each of those into three more. You navigate up to four levels of divergence, watching history reshape itself with every decision.",
      howToTitle: "How to Navigate the Butterfly Effect",
      howToSteps: [
        "An AI generates a pivotal historical moment. Read the event and its context.",
        "Choose one of three alternate branches — each represents a different way history could have diverged.",
        "Your choice expands into three more branches. Keep choosing to go deeper.",
        "Navigate up to four levels of alternate history. Watch the tree grow on the canvas as you decide.",
      ],
      faqs: [
        {
          question: "How is the historical event chosen?",
          answer:
            "GPT-4o generates a random pivotal event — a moment in history that, altered, would send civilization on a radically different path. Every session starts with a different event.",
        },
        {
          question: "What does the visual tree represent?",
          answer:
            "Each node on the canvas is a possible branch of history. Lines connect parent events to their divergences. Selected branches glow; unchosen paths fade — showing the road not taken.",
        },
        {
          question: "Can I reset and try a different path?",
          answer:
            "Yes. \"Reset Timeline\" restarts from the same root event. \"New Event\" generates an entirely new historical pivot.",
        },
      ],
    },
  },
  {
    id: "cosmic-body-clock",
    slug: "cosmic-body-clock",
    name: "Cosmic Body Clock",
    description:
      "Enter your birthdate and watch every biological counter tick live — heartbeats since birth, breaths taken, times blinked, years spent asleep, and exactly when today's memories will fade.",
    category: "biology",
    accent: "#FF3366",
    needsAI: false,
    seo: {
      introText:
        "The Cosmic Body Clock turns your lifespan into a live dashboard of biological statistics. Every number updates every second — your heartbeat count, breath total, blink count, hair grown in metres, dead skin shed in kilograms, and the exact fraction of your life spent unconscious. The Ebbinghaus Forgetting Curve shows when today's memories will dissolve unless you review them.",
      howToTitle: "How to Read Your Cosmic Body Clock",
      howToSteps: [
        "Enter your date of birth. The clock initialises from the exact moment of your birth to the present second.",
        "Watch the counters tick. Heartbeats increment roughly every 0.83 seconds. Blinks tick every 3.75 seconds.",
        "Switch between Body Stats and Sleep & Memory to explore different biological dimensions of your lifespan.",
        "Check the Ebbinghaus panel to see exactly how long you have before today's experiences begin to fade.",
      ],
      faqs: [
        {
          question: "How accurate are the body counter calculations?",
          answer:
            "The numbers use population-average rates: 72 bpm resting heart rate, 15 breaths per minute, 16 blinks per minute, 15cm of scalp hair growth per year, approximately 4kg of skin shed per year. Individual variation exists — these are medically accepted averages.",
        },
        {
          question: "What is the Ebbinghaus Forgetting Curve?",
          answer:
            "The Ebbinghaus curve, discovered by Hermann Ebbinghaus in 1885, shows how memories decay over time without reinforcement. Within 20 minutes you retain about 58% of new information. Within 24 hours, that drops to 33%. The curve shows you exactly how long you have before today's experiences become fragmented.",
        },
        {
          question: "How is 'years spent asleep' calculated?",
          answer:
            "Using the population average of 8 hours of sleep per 24-hour day — exactly one third of your life. The REM paralysis figure represents the 22% of sleep time spent in REM (rapid eye movement) sleep, during which your voluntary muscles are temporarily paralysed.",
        },
        {
          question: "Why do I have so many more dreams than I remember?",
          answer:
            "Research suggests the average person has 4–6 distinct dreams per night across multiple sleep cycles. Most are forgotten within minutes of waking unless a conscious effort is made to record them. The dreams counter reflects the total estimated dream count, not the remembered ones.",
        },
      ],
    },
  },
  {
    id: "older-than",
    slug: "older-than",
    name: "You Are Older Than",
    description:
      "Enter your birthdate and see a dynamically generated list of everything younger than you — apps, companies, inventions, cultural moments, and sci-fi future years you've already outlived.",
    category: "whimsical",
    accent: "#9B59B6",
    needsAI: false,
    seo: {
      introText:
        "You Are Older Than generates a personalised list of everything that came into existence after you did. Google, YouTube, the iPhone, Wikipedia, Instagram, ChatGPT — and dozens of other things you take for granted — are all younger than a significant portion of people alive today. The sci-fi section shows which fictional futures you've already lived through.",
      howToTitle: "How to Use You Are Older Than",
      howToSteps: [
        "Enter your date of birth. The calculator checks it against our database of companies, inventions, cultural milestones, and fictional future years.",
        "Browse everything younger than you, sorted by category: technology companies, inventions, cultural releases, and sci-fi predictions.",
        "See which fictional futures from Back to the Future, Blade Runner, Terminator, and others you have already lived through.",
      ],
      faqs: [
        {
          question: "How many items are in the database?",
          answer:
            "The database contains over 50 entries spanning technology companies, major inventions, cultural moments, and fictional future years from popular science fiction. It is curated for maximum 'wait, really?' impact.",
        },
        {
          question: "What counts as a sci-fi future year?",
          answer:
            "Any year that appeared as 'the future' in a significant film or novel — where the story was set in what was then the future but is now our past. Back to the Future II's 2015 is the most famous example: we've lived through it, and we still don't have hoverboards.",
        },
        {
          question: "Why is this disorienting?",
          answer:
            "Because we experience time as continuous flow, not as a set of timestamps. Realising that Google is younger than most people who use it daily — or that you were already alive when the internet became public — collapses the distance between 'history' and 'now' in a way that is genuinely strange.",
        },
      ],
    },
  },
  {
    id: "fictional-futures",
    slug: "fictional-futures",
    name: "Fictional Futures Countdown",
    description:
      "Every sci-fi future year we've already lived through — vs the ones still coming. Blade Runner 2049. Minority Report 2054. Star Trek 2063. How close are we, and how wrong were the predictions?",
    category: "scifi",
    accent: "#F39C12",
    needsAI: false,
    seo: {
      introText:
        "Fictional Futures Countdown maps every year that science fiction once called 'the future' against the present day. We've already lived through Orwell's 1984, the Matrix's 1999, Skynet's self-awareness in 1997, and Back to the Future's 2015. This realm shows what was predicted, what actually happened, and how much time remains before the futures still ahead of us arrive.",
      howToTitle: "How to Navigate Fictional Futures",
      howToSteps: [
        "Browse the 'Already Lived Through' section — all fictional futures that are now our past, with their original predictions and what reality delivered instead.",
        "Check the 'Still Coming' section to see how many years remain until Blade Runner 2049, Minority Report 2054, Star Trek's First Contact in 2063, and more.",
        "Use the Flux Capacitor Calculator to compute the exact wattage required to reach any target year.",
      ],
      faqs: [
        {
          question: "Which fictional future year is the most famous we've passed?",
          answer:
            "Back to the Future Part II's October 21, 2015 is the most culturally processed — it generated enormous media coverage as the date approached. We got smartphones but not hoverboards, video calling but not flying cars. The prediction hit rate was roughly 40%.",
        },
        {
          question: "What fictional futures are still ahead?",
          answer:
            "Blade Runner 2049 is the nearest major one — we have until 2049. Minority Report's pre-crime division launches in 2054 in the film's timeline. Star Trek's First Contact with the Vulcans is scheduled for 2063. Avatar's mining operations on Pandora begin in 2154.",
        },
        {
          question: "How is the Flux Capacitor wattage calculated?",
          answer:
            "The formula is ((targetYear - 2024) × 0.88) + 1.21 gigawatts. The 1.21 GW baseline is canonical from the films. The rest is extrapolation with appropriate scientific rigour (approximately none).",
        },
      ],
    },
  },
  {
    id: "grandfather-paradox",
    slug: "grandfather-paradox",
    name: "Grandfather Paradox Safety System",
    description:
      "Describe your time travel plan. The TVA's automated AI classifies it: Causal Loop (stable), Splinter Timeline (parallel universe), or Erasure Event (you cease to exist).",
    category: "scifi",
    accent: "#00B4D8",
    needsAI: true,
    seo: {
      introText:
        "The Grandfather Paradox Safety System is an automated classification service for time travel plans. Submit your intended temporal intervention and receive an official TVA case file — including paradox classification, risk level, approval probability, and a formally worded bureaucratic memo explaining whether you will erase yourself from history.",
      howToTitle: "How to Submit a Time Travel Plan",
      howToSteps: [
        "Describe your time travel plan in plain language. Be specific — 'kill Hitler' will be classified differently from 'give my younger self a stock tip'.",
        "Submit to the TVA. The system cross-references your plan against the Sacred Timeline, the temporal density index, and the current paradox probability tables.",
        "Receive your official case file: classification type, risk level, approval probability, and recommended action. Act accordingly.",
      ],
      faqs: [
        {
          question: "What are the three classification types?",
          answer:
            "CAUSAL_LOOP means your intervention creates a stable loop that has always existed — lower risk, but philosophically unsettling. SPLINTER_TIMELINE means your action creates a new parallel branch of reality — moderate risk, you survive but create an alternate universe. ERASURE_EVENT means your intervention will retroactively prevent your own existence — maximum risk.",
        },
        {
          question: "What is the temporal density index?",
          answer:
            "The temporal density index measures how many fictional and theoretical time travellers have already visited a given date. April 14 1912 (Titanic sinking) is the most congested temporal tourist destination, rated at 1.0. Significant historical moments score higher, quiet dates in the 1300s score near zero.",
        },
        {
          question: "How does the AI generate the classification?",
          answer:
            "GPT-4o analyses the logical structure of your plan — causal dependencies, self-reference, historical impact radius — and applies temporal paradox theory to assign a classification. The bureaucratic language is a stylistic choice. The underlying logic is sound.",
        },
      ],
    },
  },
  {
    id: "pet-translator",
    slug: "pet-translator",
    name: "Pet Age & Species Translator",
    description:
      "See your dog or cat's age in real-time pet-seconds, pet-minutes, and pet-years — plus how many weeks remain before they leave. And how old you'd be as a Tolkien elf or a Vulcan.",
    category: "whimsical",
    accent: "#F5A623",
    needsAI: false,
    seo: {
      introText:
        "Pet Age & Species Translator converts your pet's age into a live ticking clock running at dog-speed or cat-speed — 6.6× and 5.3× faster than human time respectively. Watch their pet-seconds accumulate faster than yours. See how many weeks of companionship remain. Then translate your own age into Tolkien elf years, Vulcan developmental phases, and Asgardian time — where you are barely a toddler.",
      howToTitle: "How to Use Pet Age & Species Translator",
      howToSteps: [
        "Select your pet type — dog or cat — and enter their age in years and months.",
        "Watch the live pet-time clock run faster than your human time. A dog's life moves at 6.6× the pace of yours.",
        "Enter your own age to see yourself translated into elf years, Vulcan years, and Asgardian time.",
      ],
      faqs: [
        {
          question: "Is the dog-to-human age conversion linear?",
          answer:
            "No. The American Veterinary Medical Association formula is non-linear: the first year of a dog's life equals about 15 human years, the second year adds 9 more, and each subsequent year adds approximately 4. A 3-year-old dog is therefore about 28 in human years, not 21.",
        },
        {
          question: "How is the remaining life estimate calculated?",
          answer:
            "Dog life expectancy averages 12 years and cat life expectancy averages 15 years (indoor cats). The remaining time is simply life expectancy minus current pet age, displayed simultaneously in years, months, and weeks for maximum emotional impact.",
        },
        {
          question: "How do Tolkien elf years work?",
          answer:
            "In Tolkien's mythology, elves reach physical maturity around 50 years of age — equivalent to a human's late teens. One elf year of development is therefore roughly equivalent to 7 human years of development. A 35-year-old human is developmentally equivalent to a 5-year-old elf.",
        },
      ],
    },
  },
  {
    id: "caffeine-lab",
    slug: "caffeine-lab",
    name: "Caffeine & Metabolism Lab",
    description:
      "Log your coffee, tea, or energy drinks and watch your caffeine level decay in real time. See exactly when you'll be ready to sleep — and when the crash is coming.",
    category: "biology",
    accent: "#84CC16",
    needsAI: false,
    seo: {
      introText:
        "The Caffeine & Metabolism Lab tracks your caffeine intake across multiple drinks and shows a live decay curve based on the 5.7-hour biological half-life. Log a coffee, an espresso, a green tea — the tool stacks all doses and shows your current caffeine level in milligrams, when the crash zone begins, and exactly when you'll have less than 50mg in your system and be ready to sleep.",
      howToTitle: "How to Track Your Caffeine",
      howToSteps: [
        "Select a beverage type and the time you drank it, then click Add Dose. Repeat for every caffeinated drink today.",
        "The decay curve appears immediately — showing your caffeine level across a 24-hour window with annotated zones: High Alert, Alert, and Sleep Ready.",
        "Check the stat cards for your current caffeine level, time until sleep-ready, and how many half-lives have elapsed.",
      ],
      faqs: [
        {
          question: "What is the caffeine half-life?",
          answer:
            "Caffeine's biological half-life averages 5.7 hours in healthy adults — meaning half of the caffeine you consume is eliminated every 5.7 hours. A 200mg dose at 8am leaves approximately 100mg at 1:42pm, 50mg at 7:24pm, and 25mg at 1:06am.",
        },
        {
          question: "When is it safe to drink coffee before bed?",
          answer:
            "Most sleep researchers recommend stopping caffeine at least 6 hours before your intended sleep time. At the 50mg threshold (roughly one-fifth of a coffee), most people experience minimal impact on sleep onset and quality.",
        },
        {
          question: "Why do some people feel caffeine less strongly?",
          answer:
            "Caffeine metabolism varies significantly by genetics (CYP1A2 enzyme variants), medication interactions, pregnancy, and habitual consumption. Slow metabolisers may have a half-life closer to 9–10 hours; fast metabolisers closer to 3–4 hours. This tool uses the population average of 5.7 hours.",
        },
        {
          question: "Can caffeine stack from multiple drinks?",
          answer:
            "Yes — and this is one of the most underappreciated aspects of caffeine consumption. If you drink a coffee at 8am (95mg), an espresso at 11am (63mg), and a green tea at 2pm (30mg), all three are still contributing to your caffeine level at 6pm. This tool sums all active doses.",
        },
      ],
    },
  },
  {
    id: "parent-child-time",
    slug: "parent-child-time",
    name: "Parent-Child Time Calculator",
    description:
      "How much of your total parent time have you already spent? Enter birthdates and contact frequency — then see the percentage that's gone, the hours remaining, and how many Christmases you have left together.",
    category: "destiny",
    accent: "#FB7185",
    needsAI: false,
    seo: {
      introText:
        "The Parent-Child Time Calculator reveals one of the most affecting statistics in a person's life: what percentage of your total time with a parent you have already used. Most people have already spent over 80% of their parent time by the time they leave home at 18. Enter your birthdate, your parent's birthdate, and how often you see each other — and see what remains.",
      howToTitle: "How to Calculate Your Parent Time",
      howToSteps: [
        "Enter your own birth date and your parent's birth date using the date pickers.",
        "Select how often you currently spend time together — live together, weekly visits, monthly visits, or holidays only.",
        "The results show the percentage of your total parent time already spent, hours remaining, milestones left, and an emotional perspective on what the numbers mean.",
      ],
      faqs: [
        {
          question: "Why have I spent so much parent time already?",
          answer:
            "Research on time use suggests that the average child spends roughly 1,000 hours per year with their parents before leaving home — and then the contact drops to a fraction of that. By the time a person leaves at 18, they may have already completed 85% or more of their total in-person parent time, assuming both parents live to average life expectancy.",
        },
        {
          question: "How is parent time calculated?",
          answer:
            "The calculator multiplies your parent's estimated remaining years (based on average life expectancy of 79) by your current weekly contact hours. It then compares that to the time already accumulated since your birth at the same rate — giving the percentage of total parent time already spent.",
        },
        {
          question: "Is the life expectancy assumption accurate?",
          answer:
            "The calculator uses 79 years as the average life expectancy for simplicity. Individual health, lifestyle, and family history all affect the actual figure significantly. The tool is designed to provoke reflection rather than precise planning.",
        },
      ],
    },
  },
  {
    id: "remaining-experiences",
    slug: "remaining-experiences",
    name: "Remaining Experiences Counter",
    description:
      "Enter your age and see how many of each life experience you have left — Christmases, full moons, sunsets, Olympic Games, haircuts, and more. Toggle between optimistic, average, and pessimistic life expectancy views.",
    category: "whimsical",
    accent: "#34D399",
    needsAI: false,
    seo: {
      introText:
        "The Remaining Experiences Counter translates your remaining years into concrete moments: exactly how many Christmases, full moons, summers, Olympic Games, Monday mornings, haircuts, and meals you have left — at average, optimistic, and pessimistic life expectancy. The numbers are oddly specific. Some are comforting. Some are not.",
      howToTitle: "How to Use the Remaining Experiences Counter",
      howToSteps: [
        "Enter your current age. The counter calculates remaining experiences based on your years left to average life expectancy.",
        "Toggle between Optimistic (90yr), Average (80yr), and Pessimistic (70yr) life expectancy to see how the numbers shift.",
        "Browse the experience grid — each card shows the count remaining with a note on frequency and context.",
      ],
      faqs: [
        {
          question: "How are the experience counts calculated?",
          answer:
            "Each experience has a frequency — some happen once a year (Christmases), some happen 365 times a year (sunsets), some happen every 4 years (Olympics). The remaining count is simply: (life expectancy - current age) × frequency per year, rounded down.",
        },
        {
          question: "Why does this feel so strange to read?",
          answer:
            "Because we never think about our experiences as finite countable things. Christmases feel eternal until they suddenly don't. Seeing '47 Christmases remaining' converts an abstract future into a specific, enumerable set — and that specificity is jarring in a way that simply knowing you will die is not.",
        },
        {
          question: "Can I use this for planning?",
          answer:
            "Some people find it motivating — a prompt to be intentional about the experiences that matter most. Others find it existentially destabilising. Both reactions are valid. Use accordingly.",
        },
      ],
    },
  },
  {
    id: "decay-sandbox",
    slug: "decay-sandbox",
    name: "Radioactive Decay Sandbox",
    description:
      "Pick a radioactive isotope — Carbon-14, Cesium-137, Polonium-210, Uranium-235 — and watch atoms decay probabilistically on a canvas. Real physics, accelerated for your viewing.",
    category: "physics",
    accent: "#22D3EE",
    needsAI: false,
    seo: {
      introText:
        "The Radioactive Decay Sandbox is a visual physics simulation. Select any isotope from a curated list, set your initial atom count, and watch the simulation run — atoms decay according to true quantum probability, not a deterministic countdown. Each decay event flashes. The curve updates. The real-world context tells you what this isotope is used for and how long it takes to become safe.",
      howToTitle: "How to Run the Decay Simulation",
      howToSteps: [
        "Select a radioactive isotope from the list. Each entry shows its half-life and real-world application.",
        "Set the number of atoms (10–200) and choose a simulation speed. Click Start.",
        "Watch atoms decay on the particle canvas — each flash is one nucleus disintegrating. The stats panel updates in real time.",
      ],
      faqs: [
        {
          question: "Is the decay simulation physically accurate?",
          answer:
            "Yes — each atom decays independently with probability P = 1 − e^(−λΔt) per time step, where λ = ln(2) / half-life. This is the quantum mechanical basis of radioactive decay: each nucleus has no memory of how long it has existed, making every decay statistically independent.",
        },
        {
          question: "What is a half-life?",
          answer:
            "A half-life is the time after which exactly half of a radioactive sample has decayed — on average. Carbon-14 has a half-life of 5,730 years, which is why it can date organic material back 50,000 years. Iodine-131 has a half-life of 8 days, which is why it clears the body quickly enough to be used in medical imaging.",
        },
        {
          question: "How is the simulation time-accelerated?",
          answer:
            "For short-lived isotopes like Iodine-131, each simulation frame represents a fraction of a real day. For long-lived isotopes like Uranium-235, each frame represents millions of years. The speed slider adjusts the time-per-frame multiplier, allowing you to witness the full decay arc of any isotope in seconds.",
        },
        {
          question: "Why does decay look random?",
          answer:
            "Because it is. Radioactive decay is one of the purest examples of quantum randomness in nature. No force, temperature, chemical state, or history affects when a specific nucleus will decay. Each atom 'decides' independently, moment to moment, with no memory of the past.",
        },
      ],
    },
  },
  {
    id: "singularity-timeline",
    slug: "singularity-timeline",
    name: "The Singularity Timeline",
    description:
      "Every AI milestone from 1950 to the predicted 2045 Singularity — with live countdowns to the events still coming. How far have we come, and how much time remains?",
    category: "scifi",
    accent: "#A855F7",
    needsAI: false,
    seo: {
      introText:
        "The Singularity Timeline maps every major AI milestone from Alan Turing's 1950 question to Ray Kurzweil's 2045 Singularity prediction — with a live countdown to each future event. We've already passed Deep Blue, AlphaGo, ChatGPT, and the point where AI first exceeded human performance on cognitive benchmarks. AGI is predicted by 2029. The Singularity arrives in 2045. A progress bar shows exactly where we stand.",
      howToTitle: "How to Navigate the Singularity Timeline",
      howToSteps: [
        "The top of the page shows a live countdown to January 1, 2045 — Kurzweil's Singularity target date.",
        "A progress bar shows what percentage of the 1950→2045 journey has elapsed.",
        "Scroll through the timeline of milestones — click any entry to expand it and read the context and source.",
      ],
      faqs: [
        {
          question: "What is the Singularity?",
          answer:
            "Ray Kurzweil's Singularity refers to a hypothetical point around 2045 when artificial intelligence surpasses human intelligence so thoroughly — and begins improving itself so rapidly — that the pace of technological change becomes impossible for humans to predict or comprehend. It is the point at which the future becomes opaque.",
        },
        {
          question: "Is the 2045 prediction credible?",
          answer:
            "Kurzweil's specific date is debated, but the general trajectory is widely accepted. Most AI researchers believe some form of transformative AI — whether called AGI or not — will arrive within decades rather than centuries. The debate is about what it will look like and whether 'Singularity' is even the right word for it.",
        },
        {
          question: "What happened in 2024 with AI benchmarks?",
          answer:
            "In 2024, frontier AI models exceeded human average performance on a majority of standardised cognitive benchmarks — including reading comprehension, logical reasoning, coding, and many professional exams. This does not mean AI is generally smarter than humans, but it crossed a significant line on measurable tasks.",
        },
      ],
    },
  },
  {
    id: "sacred-timeline-audit",
    slug: "sacred-timeline-audit",
    name: "The Sacred Timeline Audit",
    description:
      "Answer 8 questions about your life choices. The TVA's automated system classifies your variants, assigns a compliance score, and predicts your Minority Report pre-crime arrest date.",
    category: "scifi",
    accent: "#7C3AED",
    needsAI: true,
    seo: {
      introText:
        "The Sacred Timeline Audit is an automated TVA compliance system. Submit your life data — career pivots, relationship endings, unread emails, sleep schedule — and receive an official case file: your Sacred Timeline Compliance Score, a list of unauthorized variants, your pruning risk level, and the exact date Minority Report's pre-crime division would have arrested you.",
      howToTitle: "How to Submit Your Timeline for Audit",
      howToSteps: [
        "Answer all 8 questions honestly. The TVA has ways of verifying your responses.",
        "Click Submit to TVA. The AI processes your life data against the Sacred Timeline compliance database.",
        "Review your official case file: compliance score, unauthorized variants flagged, pruning risk, and your pre-crime arrest date.",
      ],
      faqs: [
        {
          question: "What is the Sacred Timeline?",
          answer:
            "In the Marvel Loki universe, the Sacred Timeline is the one approved sequence of events across all reality. The TVA (Time Variance Authority) monitors it for deviations — called Nexus Events — and prunes branches that diverge too far. This tool applies that concept to your actual life choices.",
        },
        {
          question: "What is a Nexus Event in this context?",
          answer:
            "Any life choice that significantly deviated from the most statistically probable path for someone in your demographic. Multiple career pivots, frequent city changes, and a catastrophically unmanaged inbox are classic Nexus indicators.",
        },
        {
          question: "How is the pre-crime date calculated?",
          answer:
            "The pre-crime arrest predictor draws on your behavioral pattern data and extrapolates forward using Minority Report's precognitive algorithm. The date is algorithmically derived from your answers and is disturbingly specific.",
        },
      ],
    },
  },
  {
    id: "financial-freedom-dashboard",
    slug: "financial-freedom-dashboard",
    name: "Financial Freedom Dashboard",
    description:
      "Enter your income, savings, expenses, and debt. Six simultaneous countdowns reveal exactly when you hit debt-free, $100k, $1M, work-optional, and financial peace — all on one timeline.",
    category: "destiny",
    accent: "#14B8A6",
    needsAI: false,
    seo: {
      introText:
        "The Financial Freedom Dashboard runs six simultaneous compound interest calculations and shows you exactly when each financial milestone arrives — debt-free date, 6-month safety net, $100k saved, $1M milestone, work-optional (the 4% rule crossover), and the day money stops keeping you up at night. All six land on the same timeline so the gaps between them are visible for the first time.",
      howToTitle: "How to Use the Financial Freedom Dashboard",
      howToSteps: [
        "Enter your monthly income after tax, monthly expenses, current savings, total debt, monthly debt repayment, and monthly investment amount.",
        "Set your expected annual investment return using the slider — 7% is the historical S&P 500 average after inflation.",
        "All six milestone dates calculate instantly. The timeline below shows where each lands relative to today.",
      ],
      faqs: [
        {
          question: "What is the 4% rule?",
          answer:
            "The 4% rule states that you can withdraw 4% of your investment portfolio annually without depleting it over a 30-year retirement. To cover £3,000 per month in expenses, you need £900,000 invested. The work-optional milestone is the point where your portfolio reaches this level.",
        },
        {
          question: "How is compound interest calculated?",
          answer:
            "The tool uses the standard future value formula: FV = P(1+r)^n + PMT × ((1+r)^n − 1)/r, where P is current savings, r is monthly interest rate, n is months, and PMT is monthly contribution. It then solves for n to find when the total crosses each target.",
        },
        {
          question: "Why is the work-optional date usually much later than $1M?",
          answer:
            "Because $1M at 4% withdrawal only generates $40,000 per year. If your expenses are higher, you need a larger portfolio. The work-optional date reflects your specific lifestyle cost — not an arbitrary million-dollar target.",
        },
      ],
    },
  },
  {
    id: "physical-peak-decline",
    slug: "physical-peak-decline",
    name: "Physical Peak & Decline",
    description:
      "Enter your birthdate and see exactly which athletic and cognitive peaks you've already passed, which you're in right now, and the ones still ahead — including the surprising late peaks you haven't reached yet.",
    category: "biology",
    accent: "#EAB308",
    needsAI: false,
    seo: {
      introText:
        "Physical Peak & Decline maps your age against the scientifically established performance windows for 12 different disciplines — sprinting, marathon, chess, mathematics, vocabulary, emotional intelligence, and more. Most people focus on the peaks they've missed. This tool also reveals the ones still coming: vocabulary peaks at 67, emotional intelligence in the late 50s, and wisdom in the 70s.",
      howToTitle: "How to Read Your Peak Map",
      howToSteps: [
        "Enter your date of birth. The tool calculates your current age to the day.",
        "Select any discipline to see your detailed status — whether you're before your peak, inside the window, or past it — and by how many years.",
        "Scroll the full peak map to see all 12 disciplines plotted across a timeline from age 18 to 80, with your current position marked.",
      ],
      faqs: [
        {
          question: "When do sprinters peak?",
          answer:
            "Sprint performance peaks between ages 22–26, driven by fast-twitch muscle fiber density, reaction speed, and anaerobic capacity. Usain Bolt set the 100m world record at age 22. After 26, reaction time and power output begin a gradual decline that intensifies past 30.",
        },
        {
          question: "Do cognitive abilities really peak that early?",
          answer:
            "Raw processing speed peaks around 18–24. Pattern recognition and chess performance peak in the late 20s to mid-30s. But vocabulary continues growing into the late 60s — people reliably know more words at 67 than at 27. Emotional intelligence and wisdom both show clear improvements well into the 60s and 70s.",
        },
        {
          question: "What is the books remaining calculator?",
          answer:
            "If you read a certain number of books per year and you live to your expected age, the books remaining figure is simply years left × annual reading rate. A 35-year-old reading 12 books per year with 45 years left has approximately 540 books left in their reading life. Every book choice matters.",
        },
      ],
    },
  },
  {
    id: "legacy-memory-calculator",
    slug: "legacy-memory-calculator",
    name: "Legacy & Memory Calculator",
    description:
      "After you die, how long will you still exist — as a spoken name, a digital ghost, a family memory, a DNA trace? A timeline from your death forward through every stage of dissolution.",
    category: "destiny",
    accent: "#EC4899",
    needsAI: false,
    seo: {
      introText:
        "The Legacy & Memory Calculator maps the afterlife of your existence across multiple dimensions: the last time your name is spoken aloud, the decade your Instagram becomes a ghost profile, when detailed personal memory of you fades from those who knew you, how many generations carry your name, and when your unique DNA combination finally diffuses into the general human gene pool — roughly 250 years after your death.",
      howToTitle: "How to Calculate Your Legacy",
      howToSteps: [
        "Enter your birthdate and estimated life expectancy. The tool establishes your projected death year as the starting point.",
        "Specify your number of children and your impact level — from personal (remembered by family only) to historical (changes the course of events).",
        "A dissolution timeline appears, showing every stage from physical death to the complete anonymisation of your existence.",
      ],
      faqs: [
        {
          question: "When will my name be spoken for the last time?",
          answer:
            "If you have children, your name will likely be spoken for the last time by a great-grandchild — roughly 75 years after your death. Without children, the window is shorter: approximately 30 years. After that, your name exists only in records, not in living memory.",
        },
        {
          question: "How long does a digital presence survive death?",
          answer:
            "Social media platforms currently retain inactive accounts indefinitely unless a verified next-of-kin requests deletion. Facebook alone is projected to contain more dead accounts than living users by 2070. Your digital ghost will likely outlive your family's detailed memory of you.",
        },
        {
          question: "What does DNA dissolution mean?",
          answer:
            "Each generation inherits roughly half its DNA from each parent. After 10 generations (approximately 250 years), your specific genetic combination has been divided and recombined so many times that no single living person carries a statistically meaningful portion of your unique genome. You become, genetically, part of the general human background.",
        },
      ],
    },
  },
  {
    id: "work-time-audit",
    slug: "work-time-audit",
    name: "Work Time Audit",
    description:
      "Enter your job, commute, and household routine. See exactly how many years of your life go to work, meetings, commuting, laundry, and shoe-tying — and what those same hours could have been instead.",
    category: "life",
    accent: "#6366F1",
    needsAI: false,
    seo: {
      introText:
        "The Work Time Audit converts your daily routine into lifetime totals. A 30-minute daily commute becomes 1.5 years of your working life. 23% of your work hours are spent in meetings — that is roughly 4 years of your career. Shoe-tying adds up to about 2 weeks over a lifetime. This tool shows all of it at once, then converts each block into what it could have been: books read, international trips taken, extra hours of sleep.",
      howToTitle: "How to Run Your Work Time Audit",
      howToSteps: [
        "Enter your current age, retirement age, weekly work hours, and daily commute time.",
        "Adjust the weekly hours for laundry and home cleaning tasks.",
        "The audit appears instantly — a breakdown of every major time block in your career, with equivalent uses shown alongside.",
      ],
      faqs: [
        {
          question: "How much of a career is spent in meetings?",
          answer:
            "Research from various workplace studies consistently finds that knowledge workers spend between 20–30% of their working hours in meetings, with 23% being the frequently cited average. Over a 35-year career at 40 hours per week, that is approximately 3.5–4 years of your life spent in meetings.",
        },
        {
          question: "Why is the commute calculation so significant?",
          answer:
            "A 30-minute daily commute (each way) accumulates to 250 hours per year — roughly 6.25 weeks. Over a 30-year career, that totals nearly 2 years of waking life spent in transit. Remote work or moving closer to work is one of the highest-leverage time decisions a person can make.",
        },
        {
          question: "What is the shoe-tying total?",
          answer:
            "At approximately 2.5 seconds per tie, twice a day, 365 days a year, over a 50-year adult life: roughly 2,555 minutes — about 42 hours, or close to 2 full working weeks. It is an absurd and perfectly accurate number.",
        },
      ],
    },
  },
  {
    id: "solar-system-orrery",
    slug: "solar-system-orrery",
    name: "Solar System Live Orrery",
    description:
      "A live animated solar system showing the real current positions of all 8 planets — computed from Keplerian orbital mechanics. Mars Sol clock, solar cycle position, and planetary alignment calculator.",
    category: "cosmos",
    accent: "#FCD34D",
    needsAI: false,
    seo: {
      introText:
        "The Solar System Live Orrery computes the real current positions of all eight planets using Keplerian mean-motion orbital mechanics referenced to the J2000 epoch. Watch Mercury race around the Sun while Neptune barely moves. See exactly where Earth is right now in its orbit. Check the Mars Sol clock for the current time on Mars and discover when your selected planets next come into alignment.",
      howToTitle: "How to Use the Solar System Orrery",
      howToSteps: [
        "The orrery starts animated at real orbital speeds. Use the speed multiplier to accelerate — 10,000× makes the inner planets blur into rings.",
        "Click any planet to select it and see its orbital period, distance from the Sun, number of moons, and diameter.",
        "Check the Mars Sol clock for the current Martian solar time, and the Solar Cycle meter to see where we are in the Sun's 11-year activity cycle.",
      ],
      faqs: [
        {
          question: "How accurate are the planetary positions?",
          answer:
            "The orrery uses simplified Keplerian mean-motion — J2000 mean longitudes plus mean angular velocity. This gives positions accurate to within a few degrees for display purposes. For precise ephemeris data used in navigation or professional astronomy, NASA's HORIZONS system is the authoritative source.",
        },
        {
          question: "What is a Mars Sol?",
          answer:
            "A Mars solar day (Sol) is 24 hours, 37 minutes, and 22.663 seconds — slightly longer than an Earth day. Over time, Martian time drifts relative to Earth time. The Mars Sol clock shows the current Mean Local Solar Time on Mars as if you were standing on the prime meridian used by NASA missions.",
        },
        {
          question: "What is Solar Cycle 25?",
          answer:
            "The Sun goes through an approximately 11-year cycle of activity, measured by sunspot count. Solar Cycle 25 began in December 2019 and is predicted to peak around mid-2025. At solar maximum, increased solar wind and electromagnetic activity affect satellite communications, power grids, and produces more frequent aurora displays.",
        },
      ],
    },
  },
  {
    id: "deep-time-clock",
    slug: "deep-time-clock",
    name: "Deep Time Earth Clock",
    description:
      "A 24-hour clock where the full face represents 4.5 billion years of Earth's history. Midnight = Earth forms. The second midnight = today. Humans appear at 11:58:43 PM. All of recorded history fits in the last half-second.",
    category: "cosmos",
    accent: "#FB923C",
    needsAI: false,
    seo: {
      introText:
        "The Deep Time Earth Clock compresses the entire 4.5-billion-year history of Earth into a single 24-hour clock face. Earth forms at midnight. The first life appears at around 4:30 AM. Dinosaurs don't arrive until 11:41 PM. Homo sapiens appear at 11:58:43 PM — just 77 seconds before midnight. All of recorded human civilisation occupies the final half-second of the clock.",
      howToTitle: "How to Read the Deep Time Clock",
      howToSteps: [
        "The clock face runs 24 hours — but each second represents 52,083 years of real geological time.",
        "Event markers appear around the clock face. Click any marker to read the geological context and see the exact clock time it falls on.",
        "Scroll down to see all events listed with their clock times, plus stat cards showing Earth's remaining life expectancy.",
      ],
      faqs: [
        {
          question: "What time does 'right now' appear on the clock?",
          answer:
            "Right now is midnight — the second one. The clock runs from the first midnight (Earth forms, 4.5 billion years ago) to the second midnight (today). Everything in human history — from the first cave paintings to the internet — occupies the last 0.45 seconds of the 24-hour face.",
        },
        {
          question: "When do dinosaurs appear on the clock?",
          answer:
            "Dinosaurs first appear at approximately 11:41 PM — just 19 minutes before midnight. They dominate for about 12 clock minutes before the Chicxulub impact at 11:53 PM wipes them out. The 66 million years since the impact — the entire age of mammals — fits in the last 7 minutes of the clock.",
        },
        {
          question: "When does Earth become uninhabitable?",
          answer:
            "In approximately 1 billion years, the Sun will have brightened enough to evaporate Earth's oceans. Complex life would likely end before that — around 500–800 million years from now — as increasing solar luminosity makes the planet too hot for most organisms. On the Deep Time Clock, that is approximately 3.2 hours from midnight.",
        },
      ],
    },
  },
  {
    id: "consumption-footprint",
    slug: "consumption-footprint",
    name: "Consumption Footprint",
    description:
      "Enter your age and see a portrait of your lifetime consumption translated into physical scale — garbage trucks, plastic bottles, bread loaves, eggs, swimming pools of water, and more.",
    category: "life",
    accent: "#4ADE80",
    needsAI: false,
    seo: {
      introText:
        "The Consumption Footprint converts average lifetime consumption into physical equivalents at a scale the human brain can process. A lifetime of plastic bottle use weighs more than a large car. The water you consume could fill an Olympic swimming pool twice over. The bread you will eat could fill a room. These numbers are not accusations — they are portraits of scale, shown without commentary.",
      howToTitle: "How to Read Your Consumption Portrait",
      howToSteps: [
        "Enter your current age to see consumption split between past (already used) and future (still ahead).",
        "Select your diet type — omnivore, vegetarian, or vegan — to adjust food-related metrics.",
        "Set your recycling level to adjust the plastic and waste calculations.",
      ],
      faqs: [
        {
          question: "Where do these consumption averages come from?",
          answer:
            "The figures are derived from EPA solid waste reports, UN Food and Agriculture Organization data, and peer-reviewed consumption studies for OECD countries. They represent averages — actual consumption varies significantly by country, income level, and individual habit.",
        },
        {
          question: "How much plastic does an average person use in a lifetime?",
          answer:
            "The average person in a developed country uses approximately 156 plastic bottles per year, plus significant plastic packaging from food and goods. Over an 80-year lifetime, this totals around 12,500 bottles — not counting plastic bags, packaging, and microplastics from synthetic clothing.",
        },
        {
          question: "Is this tool designed to make me feel guilty?",
          answer:
            "No. The tool presents numbers without prescriptions. The purpose is to make abstract per-year statistics concrete at a lifetime scale — the same way that knowing you will spend 26 years asleep is interesting, not depressing. What you do with the information is entirely your choice.",
        },
      ],
    },
  },
  {
    id: "pet-behavior-timers",
    slug: "pet-behavior-timers",
    name: "Pet Behavior Timers",
    description:
      "Live countdown timers for your dog or cat's behavioral patterns — food demand loops, separation anxiety onset, 3AM zoomie countdowns, and nap cycle tracking. Scientifically approximate. Uncomfortably accurate.",
    category: "whimsical",
    accent: "#E879F9",
    needsAI: false,
    seo: {
      introText:
        "Pet Behavior Timers runs live countdowns based on the actual behavioural rhythms of dogs and cats. Enter when your pet last ate and when you last left the room. The tool tracks zoomie probability by time of day, food demand onset using species-average hunger cycles, dog separation anxiety timeline, cat nap phase, and the exact countdown to the 3AM feline activity surge. All live. All ticking.",
      howToTitle: "How to Use Pet Behavior Timers",
      howToSteps: [
        "Select Dog, Cat, or Both using the pet type buttons.",
        "Enter the time your pet last ate and (for dogs) the last time they saw you leave the room.",
        "All timers start running immediately — the zoomie probability updates every minute based on time of day.",
      ],
      faqs: [
        {
          question: "Are these timers scientifically accurate?",
          answer:
            "They are based on published ethological research — dog separation anxiety onset (~14–20 minutes post-departure), cat hunger cycles (4–6 hours), canine zoomie peaks (early morning and late evening), and feline nap cycle durations (~90 minutes). Individual animals vary significantly. Your cat may have its own agenda.",
        },
        {
          question: "What causes the 3AM zoomies?",
          answer:
            "Cats are crepuscular — most active at dawn and dusk in the wild. Indoor cats often shift this activity window later due to artificial lighting and owner schedules, with peak nocturnal activity typically falling between 2–4 AM. The burst of energy is a release of pent-up hunting instinct from an animal that has been sedentary during human sleeping hours.",
        },
        {
          question: "Why does my dog follow me to the bathroom?",
          answer:
            "Separation anxiety in dogs begins within 14–20 minutes of owner departure on average, but many dogs show anticipatory behaviours — following, whining, door-sitting — within seconds of sensing departure cues. The bathroom represents a very short, recurring separation that triggers this response in anxious dogs.",
        },
      ],
    },
  },
  {
    id: "hygiene-habit-timers",
    slug: "hygiene-habit-timers",
    name: "Hygiene & Habit Timers",
    description:
      "Enter when you last washed your jeans, washed your bed sheets, got a haircut, and cleaned your water bottle. See exactly where you stand on each hygiene threshold — with bacterial colony estimates.",
    category: "whimsical",
    accent: "#38BDF8",
    needsAI: false,
    seo: {
      introText:
        "Hygiene & Habit Timers applies actual textile science and microbiology to four everyday habits — jeans rewear cycles, bed sheet washing intervals, the perfect haircut window, and water bottle bacterial growth. Enter the date of each last event and see a live status for each: whether you are in the safe zone, approaching a threshold, or well past the point where science would like a word with you.",
      howToTitle: "How to Use Hygiene & Habit Timers",
      howToSteps: [
        "Enter the date you last washed your jeans, changed your bed sheets, got a haircut, and washed your water bottle.",
        "Each timer calculates your current status against research-based thresholds and shows a colour-coded progress bar.",
        "The bacterial colony estimates are order-of-magnitude approximations designed for impact rather than precision. They are accurate enough to be uncomfortable.",
      ],
      faqs: [
        {
          question: "How often should you wash your jeans?",
          answer:
            "Levi Strauss CEO Chip Bergh famously wears his jeans for months without washing to preserve fabric integrity. Textile researchers suggest 5–10 wears before washing for most denim. Microbiology research from the University of Alberta found no significant health risk from extended wear — but bacterial colonies do grow substantially after 15+ days.",
        },
        {
          question: "How dirty are unwashed water bottles?",
          answer:
            "A 2024 study found that reusable water bottles can harbor more bacteria per square centimetre than a toilet seat after 72 hours without cleaning. Biofilm — a protective community of bacteria — begins forming within 24 hours. This does not necessarily cause illness, but the numbers are striking.",
        },
        {
          question: "What is the perfect haircut window?",
          answer:
            "Most hairdressers and barbers describe days 3–7 after a cut as the optimal window — the haircut has 'settled' from its initial tight shape and has not yet grown out significantly. This varies by hair type, growth rate, and style.",
        },
      ],
    },
  },
  {
    id: "boredom-physics",
    slug: "boredom-physics",
    name: "Boredom Physics Suite",
    description:
      "Four scientific modules on subjective time distortion: Meeting Time Dilation, the Watchpot Effect, the Task Abandonment Clock, and Daydream Velocity. Time genuinely moves differently when you are bored.",
    category: "physics",
    accent: "#818CF8",
    needsAI: false,
    seo: {
      introText:
        "The Boredom Physics Suite applies real cognitive science to four measurable phenomena of subjective time. Boring meetings genuinely feel 40–60% longer than their scheduled duration. Watching a timer makes it run slower. The average knowledge worker loses focus after 23 minutes. And at sufficient boredom, the mind will wander within 10 seconds. This suite calculates all four.",
      howToTitle: "How to Use the Boredom Physics Suite",
      howToSteps: [
        "Select your meeting type and duration in Module 1 to calculate the subjective felt time versus clock time.",
        "Watch the Watchpot Effect in Module 2 — two clocks, same speed, radically different psychological experience.",
        "Let Module 3 track how long you have been on this page. It will tell you when you statistically stopped paying attention.",
      ],
      faqs: [
        {
          question: "Why do boring meetings feel so much longer?",
          answer:
            "Psychological time perception is driven by the number of new stimuli your brain processes. Passive, repetitive meetings offer few novel inputs — your brain fills this void with an inflated sense of duration. Research by Claudia Hammond and others consistently shows boring intervals feel 30–60% longer than their actual length.",
        },
        {
          question: "Is the Watchpot Effect real?",
          answer:
            "Yes — it is called the 'watched pot effect' or 'time monitoring effect' and is well-established in time perception research. Actively monitoring a duration causes more attention to be devoted to the passage of time itself, which paradoxically makes it feel slower. The effect peaks when you have nothing else to think about.",
        },
        {
          question: "How is daydream velocity calculated?",
          answer:
            "The formula combines boredom level and caffeine depletion to estimate time-to-first-mind-wander. At boredom level 1 and a fresh coffee, the mind stays on task for around 3 minutes. At boredom level 10 and 6 hours post-coffee, mind wander begins in under 10 seconds. The formula is a simplification of attentional fatigue models.",
        },
      ],
    },
  },
];
