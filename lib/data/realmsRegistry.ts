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
    howToSteps: string[];
    faqs: { question: string; answer: string }[];
  };
};

export const realmsRegistry: Realm[] = [
  {
    "id": "solar-system-age",
    "slug": "solar-system-age",
    "name": "Solar System Age Dashboard",
    "description": "Visualize elapsed celestial time and planetary orbits since the birth of our Sun.",
    "category": "cosmos",
    "accent": "#4B8EF1",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Solar System Age Dashboard</strong> provides an astronomical perspective on your lifetime. By calculating the exact planetary orbits of Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune, you can view your precise celestial age across the solar system.",
      "howToSteps": [
        "Input your Earth birthdate to begin calculations.",
        "Toggle the orbital simulation speeds on the dashboard.",
        "Compare your ages and next upcoming birthdays across all planets."
      ],
      "faqs": [
        {
          "question": "Why is my age different on other planets?",
          "answer": "Planets orbit the Sun at different distances and velocities. Mercury orbits in just 88 Earth days, meaning you are much older in Mercury years, while Neptune takes 165 Earth years to complete a single orbit."
        },
        {
          "question": "How is distance traveled calculated?",
          "answer": "It multiplies your seconds alive by Earth's orbital speed of approximately 29.78 kilometers per second."
        },
        {
          "question": "How do scientists measure cosmic distances?",
          "answer": "Astronomers use standard candles, such as Type Ia supernovae and Cepheid variables, along with cosmic redshift measurements to calculate immense stellar distances."
        },
        {
          "question": "Is cosmic expansion speeding up?",
          "answer": "Yes, cosmological observations show that the expansion of the universe is accelerating, driven by dark energy which accounts for roughly 68% of the universe."
        }
      ]
    }
  },
  {
    "id": "cosmic-countdown",
    "slug": "cosmic-countdown",
    "name": "Cosmic Countdown Console",
    "description": "Watch the countdown to the heat death of the universe and other stellar end-state events.",
    "category": "cosmos",
    "accent": "#4B8EF1",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Cosmic Countdown Console</strong> monitors the terminal timeline of our universe. From the boiling of Earth's oceans to the final evaporation of black holes via Hawking radiation, explore the milestones of the deep future.",
      "howToSteps": [
        "Select an event from the countdown registry list.",
        "Read the astrophysical breakdown of the countdown's scientific basis.",
        "Toggle log scale calculations for astronomical eras."
      ],
      "faqs": [
        {
          "question": "What is the Heat Death of the universe?",
          "answer": "It is the thermodynamic state where the universe reaches maximum entropy and no free thermodynamic energy remains to sustain motion or life."
        },
        {
          "question": "Are these countdowns scientifically accurate?",
          "answer": "Yes, they are based on current mainstream models of stellar evolution, general relativity, and cosmological expansion rates."
        },
        {
          "question": "How do scientists measure cosmic distances?",
          "answer": "Astronomers use standard candles, such as Type Ia supernovae and Cepheid variables, along with cosmic redshift measurements to calculate immense stellar distances."
        },
        {
          "question": "Is cosmic expansion speeding up?",
          "answer": "Yes, cosmological observations show that the expansion of the universe is accelerating, driven by dark energy which accounts for roughly 68% of the universe."
        }
      ]
    }
  },
  {
    "id": "relativistic-travel",
    "slug": "relativistic-travel",
    "name": "Relativistic Travel Suite",
    "description": "Calculate dilation metrics for journeying to stars near the speed of light.",
    "category": "cosmos",
    "accent": "#4B8EF1",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Relativistic Travel Suite</strong> models speed-of-light journeys. Input flight parameters to see how velocity slows time for the traveler relative to static observers on Earth.",
      "howToSteps": [
        "Select a stellar destination (e.g. Alpha Centauri, Andromeda).",
        "Set your target velocity as a percentage of the speed of light.",
        "Observe the temporal separation metrics between you and Earth."
      ],
      "faqs": [
        {
          "question": "What is time dilation?",
          "answer": "According to Einstein's Special Relativity, time passes slower for objects moving at high speeds relative to a stationary observer."
        },
        {
          "question": "Can we travel at lightspeed?",
          "answer": "Objects with mass require infinite energy to reach lightspeed, but we can travel arbitrarily close to it (e.g. 99.99% c)."
        },
        {
          "question": "How do scientists measure cosmic distances?",
          "answer": "Astronomers use standard candles, such as Type Ia supernovae and Cepheid variables, along with cosmic redshift measurements to calculate immense stellar distances."
        },
        {
          "question": "Is cosmic expansion speeding up?",
          "answer": "Yes, cosmological observations show that the expansion of the universe is accelerating, driven by dark energy which accounts for roughly 68% of the universe."
        }
      ]
    }
  },
  {
    "id": "body-in-numbers",
    "slug": "body-in-numbers",
    "name": "Your Body in Numbers",
    "description": "Discover your biological clocks: heartbeats, breaths, and cell divisions in your lifetime.",
    "category": "biology",
    "accent": "#C9A84C",
    "needsAI": false,
    "seo": {
      "introText": "<strong>Your Body in Numbers</strong> reveals the live biological meters ticking inside you. Every second, your heart pumps, lungs expand, and millions of cells divide to sustain your consciousness.",
      "howToSteps": [
        "Enter your birthdate and birth time.",
        "Observe the live-ticking counts of biological events.",
        "Adjust assumptions such as average resting heart rate."
      ],
      "faqs": [
        {
          "question": "How are biological rates estimated?",
          "answer": "Estimates use standard medical averages (e.g., 80,000 heartbeats and 20,000 breaths per day) scaled to your exact duration of life."
        },
        {
          "question": "Why do cell division counts tick so quickly?",
          "answer": "The human body replaces roughly 330 billion cells daily, which equates to nearly 3.8 million divisions per second."
        },
        {
          "question": "What is the average lifespan of human cells?",
          "answer": "Different cells have vastly different lifespans: red blood cells live about 120 days, skin cells live for 2-3 weeks, while most brain neurons last a lifetime."
        },
        {
          "question": "How does DNA store genetic information?",
          "answer": "DNA uses a double-helix sequence of four chemical bases (adenine, guanine, cytosine, and thymine) to encode the blueprints for building proteins."
        }
      ]
    }
  },
  {
    "id": "deep-time-context",
    "slug": "deep-time-context",
    "name": "Deep Time Life Context",
    "description": "Compare your human lifespan against the vast epochs of geological and universal time.",
    "category": "cosmos",
    "accent": "#4B8EF1",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Deep Time Life Context</strong> explorer places your individual lifespan within the context of cosmic and geological epochs. From the extinction of the dinosaurs to the birth of the Milky Way, see how small our temporal footprint is.",
      "howToSteps": [
        "Scroll horizontally through the timeline of historical epochs.",
        "Locate your personal lifespan box mapped visually against geological time.",
        "Compare civilization milestones to planet Earth's age."
      ],
      "faqs": [
        {
          "question": "What is Deep Time?",
          "answer": "Deep Time is the concept of geological time, which is so vast that it exceeds standard human comprehension scales."
        },
        {
          "question": "How old is Earth compared to the Universe?",
          "answer": "Earth is 4.54 billion years old, whereas the universe is approximately 13.8 billion years old."
        },
        {
          "question": "How do scientists measure cosmic distances?",
          "answer": "Astronomers use standard candles, such as Type Ia supernovae and Cepheid variables, along with cosmic redshift measurements to calculate immense stellar distances."
        },
        {
          "question": "Is cosmic expansion speeding up?",
          "answer": "Yes, cosmological observations show that the expansion of the universe is accelerating, driven by dark energy which accounts for roughly 68% of the universe."
        }
      ]
    }
  },
  {
    "id": "black-hole-gravity",
    "slug": "black-hole-gravity",
    "name": "Black Hole Gravity Playground",
    "description": "Enter the event horizon to calculate extreme gravitational time dilation fields.",
    "category": "physics",
    "accent": "#4B8EF1",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Black Hole Gravity Playground</strong> simulates General Relativistic dynamics. Control a massive singularity on a virtual canvas, throw particles into its orbit, and watch time dilation warp orbital vectors.",
      "howToSteps": [
        "Drag the singularity to position it on the canvas.",
        "Launch particles with your mouse or touch swipe to establish orbits.",
        "Enable the lensing displacement mode to see visual spatial warping."
      ],
      "faqs": [
        {
          "question": "What is gravitational time dilation?",
          "answer": "General Relativity states that gravity warps spacetime; the stronger the gravitational field, the slower time passes."
        },
        {
          "question": "What is spaghettification?",
          "answer": "It is the stretching of objects vertically and compressing horizontally caused by extreme tidal forces near a singularity."
        },
        {
          "question": "What is the speed of light?",
          "answer": "The speed of light in a vacuum is exactly 299,792,458 meters per second, serving as the absolute speed limit for information transfer in our universe."
        },
        {
          "question": "How does quantum mechanics differ from relativity?",
          "answer": "Relativity governs massive, cosmic-scale objects through gravity and curved space, while quantum mechanics governs subatomic particles through probability fields and discrete energy packets."
        }
      ]
    }
  },
  {
    "id": "spacetime-fabric",
    "slug": "spacetime-fabric",
    "name": "Spacetime Fabric Grid",
    "description": "Interact with a virtual gravity well warping light cones and temporal lines.",
    "category": "physics",
    "accent": "#4B8EF1",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Spacetime Fabric Grid</strong> provides a tactile simulation of Einstein's grid. Place masses onto a rubber-sheet-style grid and observe how spacetime curves around massive bodies.",
      "howToSteps": [
        "Click or tap the grid to place stellar masses.",
        "Toggle grid tension, mass sizes, and particle velocities.",
        "Observe how orbits decay and warp as they slide into gravity wells."
      ],
      "faqs": [
        {
          "question": "How does mass warp spacetime?",
          "answer": "John Wheeler summarized General Relativity: 'Matter tells space how to curve; space tells matter how to move.'"
        },
        {
          "question": "Is this simulation mathematically accurate?",
          "answer": "It uses a simplified Newtonian gravity approximation to animate orbits on a deformed mesh in real-time."
        },
        {
          "question": "What is the speed of light?",
          "answer": "The speed of light in a vacuum is exactly 299,792,458 meters per second, serving as the absolute speed limit for information transfer in our universe."
        },
        {
          "question": "How does quantum mechanics differ from relativity?",
          "answer": "Relativity governs massive, cosmic-scale objects through gravity and curved space, while quantum mechanics governs subatomic particles through probability fields and discrete energy packets."
        }
      ]
    }
  },
  {
    "id": "wormhole-portal",
    "slug": "wormhole-portal",
    "name": "Wormhole Portal",
    "description": "Bridge two distinct temporal points and model the causality constraint curves.",
    "category": "physics",
    "accent": "#4B8EF1",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Wormhole Portal</strong> models an Einstein-Rosen bridge. Drag the Entry and Exit portals, feed particles into the throat, and observe transit velocities across spacetime.",
      "howToSteps": [
        "Drag the portal nodes to separate positions in space.",
        "Adjust throat width and warping speed parameters.",
        "Launch particles to watch them tunnel between portals."
      ],
      "faqs": [
        {
          "question": "What is an Einstein-Rosen Bridge?",
          "answer": "It is a theoretical solution to Einstein's field equations that represents a shortcut connecting two distant points in spacetime."
        },
        {
          "question": "Are wormholes real?",
          "answer": "They are mathematically possible under General Relativity, but their stability requires exotic matter with negative energy density."
        },
        {
          "question": "What is the speed of light?",
          "answer": "The speed of light in a vacuum is exactly 299,792,458 meters per second, serving as the absolute speed limit for information transfer in our universe."
        },
        {
          "question": "How does quantum mechanics differ from relativity?",
          "answer": "Relativity governs massive, cosmic-scale objects through gravity and curved space, while quantum mechanics governs subatomic particles through probability fields and discrete energy packets."
        }
      ]
    }
  },
  {
    "id": "time-dilation-slider",
    "slug": "time-dilation-slider",
    "name": "Time Dilation Slider",
    "description": "Adjust travel velocity to instantly compare aging rates between a traveler and observer.",
    "category": "physics",
    "accent": "#4B8EF1",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Time Dilation Slider</strong> demonstrates Special Relativity in a single slider. Dilate time by increasing speed, comparing clocks side-by-side between an observer on Earth and a rocket traveler.",
      "howToSteps": [
        "Drag the speed slider up to speed-of-light percentages.",
        "Observe the clocks tick at differing rates.",
        "Review twin age metrics and radioactive isotope decay counters."
      ],
      "faqs": [
        {
          "question": "What is the Lorentz factor?",
          "answer": "It is the factor by which time, length, and relativistic mass change for an object while that object is moving."
        },
        {
          "question": "What is the Twin Paradox?",
          "answer": "If one twin travels near lightspeed, they return younger than their Earth-bound sibling, resolving because the traveler twin accelerated."
        },
        {
          "question": "What is the speed of light?",
          "answer": "The speed of light in a vacuum is exactly 299,792,458 meters per second, serving as the absolute speed limit for information transfer in our universe."
        },
        {
          "question": "How does quantum mechanics differ from relativity?",
          "answer": "Relativity governs massive, cosmic-scale objects through gravity and curved space, while quantum mechanics governs subatomic particles through probability fields and discrete energy packets."
        }
      ]
    }
  },
  {
    "id": "planet-billiards",
    "slug": "planet-billiards",
    "name": "Planet Billiards",
    "description": "Simulate orbital gravitational slingshots and watch time distort across orbits.",
    "category": "physics",
    "accent": "#4B8EF1",
    "needsAI": false,
    "seo": {
      "introText": "<strong>Planet Billiards</strong> is a sandbox gravity simulator. Spawn planetary bodies, launch them, configure orbits, and watch them collide, merge, or slingshot out of bounds.",
      "howToSteps": [
        "Select a system preset or place planets manually.",
        "Use mouse scroll or pinch to zoom the viewport around the center of mass.",
        "Click to spawn a new planet and swipe to launch it with an initial vector."
      ],
      "faqs": [
        {
          "question": "What is the N-body problem?",
          "answer": "It is the problem of predicting the individual motions of a group of celestial objects interacting with each other gravitationally."
        },
        {
          "question": "How do planets merge?",
          "answer": "In this simulator, if two bodies collide, they combine their masses and momentum to form a single larger body."
        },
        {
          "question": "What is the speed of light?",
          "answer": "The speed of light in a vacuum is exactly 299,792,458 meters per second, serving as the absolute speed limit for information transfer in our universe."
        },
        {
          "question": "How does quantum mechanics differ from relativity?",
          "answer": "Relativity governs massive, cosmic-scale objects through gravity and curved space, while quantum mechanics governs subatomic particles through probability fields and discrete energy packets."
        }
      ]
    }
  },
  {
    "id": "what-year-am-i",
    "slug": "what-year-am-i",
    "name": "What Year Am I In?",
    "description": "Input clues or answer cryptic questions to let AI determine which temporal era you're trapped in.",
    "category": "scifi",
    "accent": "#7B61FF",
    "needsAI": true,
    "seo": {
      "introText": "<strong>What Year Am I In?</strong> is a cooperative detective game with an AI temporal coordinator. Input clues or facts one at a time, and the AI will narrow down the year, providing hot/cold hints.",
      "howToSteps": [
        "Type a fact about your current location's historical features.",
        "Observe the timeline bar narrow and follow the hot/cold temperature indicators.",
        "Keep inputting facts until your coordinate reaches 90%+ confidence to lock."
      ],
      "faqs": [
        {
          "question": "How does the AI determine the year?",
          "answer": "The server-side LLM parses your collection of facts against its database of historical milestones to narrow down the range."
        },
        {
          "question": "What happens when the confidence locks?",
          "answer": "The timeline locks to a single year and triggers an era celebration."
        },
        {
          "question": "What is a closed timelike curve?",
          "answer": "A closed timelike curve is a path in spacetime that loops back on itself in time, theoretically allowing physical particles to return to their own past under general relativity."
        },
        {
          "question": "What is the bootstrap paradox?",
          "answer": "A paradox of time travel where information or an object is sent back in time, becoming the very trigger for its own creation, leaving it with no true origin."
        }
      ]
    }
  },
  {
    "id": "butterfly-effect",
    "slug": "butterfly-effect",
    "name": "Butterfly Effect Calculator",
    "description": "Change a minute past action and let AI generate the cascading timeline deviations.",
    "category": "scifi",
    "accent": "#7B61FF",
    "needsAI": true,
    "seo": {
      "introText": "The **Butterfly Effect Calculator** is a branching timeline simulator. Type a minor historical change, select your target domains, and trace the divergent paths of history.",
      "howToSteps": [
        "Type your minor historical modification and slide the year slider.",
        "Choose focus domains (e.g. War, Politics) to shape the branches.",
        "Select branch options level-by-level to build a custom timeline tree."
      ],
      "faqs": [
        {
          "question": "What is the Butterfly Effect?",
          "answer": "A concept from chaos theory stating that small, seemingly minor changes in initial conditions can lead to massive, unpredictable downstream differences."
        },
        {
          "question": "How many levels does the timeline tree explore?",
          "answer": "The explorer traces your timeline across 5 levels from the original event up to the present day."
        },
        {
          "question": "What is a closed timelike curve?",
          "answer": "A closed timelike curve is a path in spacetime that loops back on itself in time, theoretically allowing physical particles to return to their own past under general relativity."
        },
        {
          "question": "What is the bootstrap paradox?",
          "answer": "A paradox of time travel where information or an object is sent back in time, becoming the very trigger for its own creation, leaving it with no true origin."
        }
      ]
    }
  },
  {
    "id": "born-wrong-era",
    "slug": "born-wrong-era",
    "name": "Born Too Late/Early Matrix",
    "description": "Describe your tastes to map your personality into your true cosmic historical epoch.",
    "category": "whimsical",
    "accent": "#3ABFBF",
    "needsAI": true,
    "seo": {
      "introText": "The <strong>Born Too Late/Early Matrix</strong> determines your true spiritual timeline. Participate in an era speed-dating exercise, swiping or clicking to accept or reject different historical epochs.",
      "howToSteps": [
        "Evaluate the facts displayed on each era card.",
        "Select 'THIS IS ME' or 'NOT FOR ME' for all 5 eras.",
        "Read the AI's final assessment of your true temporal alignment."
      ],
      "faqs": [
        {
          "question": "How does the matching work?",
          "answer": "The AI takes your choices, identifies common values (e.g., preference for nature vs. technology), and maps you to a corresponding era."
        },
        {
          "question": "Can I review why an era was wrong?",
          "answer": "Yes, the final report explains why you rejected certain eras."
        },
        {
          "question": "How should I balance time wasting?",
          "answer": "Amusing distractions are a vital part of cognitive recovery. True time wasting is only a paradox when it stops being entertaining."
        },
        {
          "question": "Can we truly waste time?",
          "answer": "Time passes regardless of action. Whether a second is 'wasted' or 'invested' is entirely a matter of perspective and personal value."
        }
      ]
    }
  },
  {
    "id": "genius-age-matcher",
    "slug": "genius-age-matcher",
    "name": "Famous Genius Age Matcher",
    "description": "Compare your age accomplishments to historical giants and receive motivational AI insight.",
    "category": "biology",
    "accent": "#C9A84C",
    "needsAI": true,
    "seo": {
      "introText": "The <strong>Famous Genius Age Matcher</strong> compares your achievements to historical giants. Input your age to see what Newton, Einstein, or Marie Curie were doing at that exact moment.",
      "howToSteps": [
        "Input your age in years or dates.",
        "Compare biographical details side-by-side.",
        "Receive motivational AI feedback regarding your timeline."
      ],
      "faqs": [
        {
          "question": "Is this meant to make me feel bad?",
          "answer": "Not at all! The AI contextualizes accomplishments in terms of circumstances, encouraging you on your path."
        },
        {
          "question": "Can I select which geniuses to compare against?",
          "answer": "Yes, you can toggle profiles in the panel controls."
        },
        {
          "question": "What is the average lifespan of human cells?",
          "answer": "Different cells have vastly different lifespans: red blood cells live about 120 days, skin cells live for 2-3 weeks, while most brain neurons last a lifetime."
        },
        {
          "question": "How does DNA store genetic information?",
          "answer": "DNA uses a double-helix sequence of four chemical bases (adenine, guanine, cytosine, and thymine) to encode the blueprints for building proteins."
        }
      ]
    }
  },
  {
    "id": "quantum-leap",
    "slug": "quantum-leap",
    "name": "Quantum Leap Destination",
    "description": "Jump blindly into the temporal stream and receive an AI log of your new identity.",
    "category": "scifi",
    "accent": "#7B61FF",
    "needsAI": true,
    "seo": {
      "introText": "The <strong>Quantum Leap Destination</strong> simulates a conversational leap through time. Answer the temporal coordinator's prompts, initialize the leap grid, and review your new historical mission briefing.",
      "howToSteps": [
        "Answer the coordinator's prompts about your strengths and challenges.",
        "Click to launch the Leap animation sequence.",
        "Read the typewriter-revealed mission cards showing your host body and targets."
      ],
      "faqs": [
        {
          "question": "Can I request a different leap destination?",
          "answer": "Yes, click 'Request New Leap' to cycle parameters and leap again."
        },
        {
          "question": "How are host bodies selected?",
          "answer": "The AI selects a historically appropriate figure matching your responses."
        },
        {
          "question": "What is a closed timelike curve?",
          "answer": "A closed timelike curve is a path in spacetime that loops back on itself in time, theoretically allowing physical particles to return to their own past under general relativity."
        },
        {
          "question": "What is the bootstrap paradox?",
          "answer": "A paradox of time travel where information or an object is sent back in time, becoming the very trigger for its own creation, leaving it with no true origin."
        }
      ]
    }
  },
  {
    "id": "retrocausality",
    "slug": "retrocausality",
    "name": "Retrocausality Engine",
    "description": "Send messages backward in time to see how they retroactively rewrite your AI profile.",
    "category": "scifi",
    "accent": "#7B61FF",
    "needsAI": true,
    "seo": {
      "introText": "The <strong>Retrocausality Engine</strong> is a live control room dashboard. Type your current activities, watch the chronal interference needle oscillate, and monitor how your timeline is rewritten.",
      "howToSteps": [
        "Type your actions after the command line prompt.",
        "Watch the gauge needle and paradox integrity metrics update.",
        "Read the list of affected past events returned from the API."
      ],
      "faqs": [
        {
          "question": "What is retrocausality?",
          "answer": "A concept in physics stating that a decision made in the present or future can influence events in the past."
        },
        {
          "question": "What triggers the API updates?",
          "answer": "The console uses a debounced text listener that triggers 1.5 seconds after you stop typing."
        },
        {
          "question": "What is a closed timelike curve?",
          "answer": "A closed timelike curve is a path in spacetime that loops back on itself in time, theoretically allowing physical particles to return to their own past under general relativity."
        },
        {
          "question": "What is the bootstrap paradox?",
          "answer": "A paradox of time travel where information or an object is sent back in time, becoming the very trigger for its own creation, leaving it with no true origin."
        }
      ]
    }
  },
  {
    "id": "alternate-history",
    "slug": "alternate-history",
    "name": "Alternate History Animator",
    "description": "Merge two historical periods and let AI narrate the resulting hybrid civilization.",
    "category": "scifi",
    "accent": "#7B61FF",
    "needsAI": true,
    "seo": {
      "introText": "The <strong>Alternate History Animator</strong> merges different historical timelines. Choose a primary historical period and an overlapping technological deviation to simulate a hybrid civilization.",
      "howToSteps": [
        "Select your core historical era and geographic coordinates.",
        "Introduce a temporal shift variable (e.g. Steam-powered Rome).",
        "Generate and view the detailed timeline narrative outlining this hybrid world."
      ],
      "faqs": [
        {
          "question": "How are hybrid timelines compiled?",
          "answer": "The AI models the convergence, describing the resulting social, military, and domestic changes."
        },
        {
          "question": "Can I share my alternate history map?",
          "answer": "Yes, the share utility encodes your configurations in the URL."
        },
        {
          "question": "What is a closed timelike curve?",
          "answer": "A closed timelike curve is a path in spacetime that loops back on itself in time, theoretically allowing physical particles to return to their own past under general relativity."
        },
        {
          "question": "What is the bootstrap paradox?",
          "answer": "A paradox of time travel where information or an object is sent back in time, becoming the very trigger for its own creation, leaving it with no true origin."
        }
      ]
    }
  },
  {
    "id": "destiny-matrix",
    "slug": "destiny-matrix",
    "name": "God of Time Destiny Matrix",
    "description": "Read your alignment under the shifting celestial chronometers and unlock your temporal path.",
    "category": "destiny",
    "accent": "#E09A3A",
    "needsAI": true,
    "seo": {
      "introText": "The <strong>God of Time Destiny Matrix</strong> is a multi-step temporal diagnostic tool. Input your birth details and values to map your position relative to cosmic timescales.",
      "howToSteps": [
        "Complete the 4-step wizard form.",
        "Watch constellation links draw dynamically based on your progress.",
        "Trigger the typewriter scan reveal to read your spacetime alignment report."
      ],
      "faqs": [
        {
          "question": "What is a Destiny Matrix?",
          "answer": "It is a cosmic coordinate diagnostic outlining your historical position, cosmic role, and temporal legacy."
        },
        {
          "question": "How do step transitions animate?",
          "answer": "The form pages use a 3D rotateY perspective sweep that simulates turning a paper book page."
        },
        {
          "question": "What is the significance of temporal alignment?",
          "answer": "It represents the intersection of universal cosmic milestones and individual conscious lifelines, highlighting our unique coordinates in time."
        },
        {
          "question": "Is my destiny predetermined?",
          "answer": "While physical laws outline the bounds of possibility, your conscious choices determine the actual path you take through the timeline."
        }
      ]
    }
  },
  {
    "id": "cosmic-personal-stats",
    "slug": "cosmic-personal-stats",
    "name": "Cosmic Personal Stats",
    "description": "Calculate your age in galactic years, cosmic calendar position, and light travel distance.",
    "category": "cosmos",
    "accent": "#4B8EF1",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Cosmic Personal Stats</strong> calculator is a comprehensive dashboard summarizing your time relative to deep space. Track how many galactic years you've lived and how far your birth light has traveled.",
      "howToSteps": [
        "Input your Earth date of birth.",
        "Explore sections: Planetary Ages, Cosmic Coordinates, and Space Travel.",
        "Observe the live-ticking counts of lightyears traveled and cosmic ray penetrations."
      ],
      "faqs": [
        {
          "question": "What is a Galactic Year?",
          "answer": "A galactic year (or cosmic year) is the time it takes the Solar System to orbit the center of the Milky Way galaxy, roughly 230 million Earth years."
        },
        {
          "question": "What is the Cosmic Calendar?",
          "answer": "A scale mapping the 13.8 billion year history of the universe onto a single calendar year, where human history occupies the final seconds."
        },
        {
          "question": "How do scientists measure cosmic distances?",
          "answer": "Astronomers use standard candles, such as Type Ia supernovae and Cepheid variables, along with cosmic redshift measurements to calculate immense stellar distances."
        },
        {
          "question": "Is cosmic expansion speeding up?",
          "answer": "Yes, cosmological observations show that the expansion of the universe is accelerating, driven by dark energy which accounts for roughly 68% of the universe."
        }
      ]
    }
  },
  {
    "id": "life-mosaic",
    "slug": "life-mosaic",
    "name": "Life Mosaic",
    "description": "Visualize your lifespan as a grid of weeks and track your remaining weekends and sunsets.",
    "category": "destiny",
    "accent": "#E09A3A",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Life Mosaic</strong> grid displays your lifespan in weeks. Mapping a standard life expectancy, it reveals past weeks lived, the current week, and future weeks remaining.",
      "howToSteps": [
        "Input your birthdate and average life expectancy.",
        "Hover over grid blocks to view corresponding calendar dates.",
        "Review stat cards outlining remaining sunsets, weekends, and celebrations."
      ],
      "faqs": [
        {
          "question": "How many weeks are in an 80-year life?",
          "answer": "An 80-year lifespan contains exactly 4,160 weeks, represented as a 80x52 grid."
        },
        {
          "question": "Are my input details saved?",
          "answer": "No, all calculations run client-side in the browser to ensure data privacy."
        },
        {
          "question": "What is the significance of temporal alignment?",
          "answer": "It represents the intersection of universal cosmic milestones and individual conscious lifelines, highlighting our unique coordinates in time."
        },
        {
          "question": "Is my destiny predetermined?",
          "answer": "While physical laws outline the bounds of possibility, your conscious choices determine the actual path you take through the timeline."
        }
      ]
    }
  },
  {
    "id": "time-wasters",
    "slug": "time-wasters",
    "name": "Time Wasters Hall of Shame",
    "description": "Estimate how many years of your life will be spent on traffic, chores, and staring at the fridge.",
    "category": "whimsical",
    "accent": "#3ABFBF",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Time Wasters Hall of Shame</strong> calculates time spent on mundane activities. Tick your daily habits to estimate how many months or years you will spend waiting in traffic or looking for the remote.",
      "howToSteps": [
        "Select your current age.",
        "Check boxes corresponding to your daily routine chores.",
        "Explore cards outlining accumulated months and years spent on each activity."
      ],
      "faqs": [
        {
          "question": "How are these estimations calculated?",
          "answer": "Calculations scale standard time-use survey averages to your expected remaining lifetime."
        },
        {
          "question": "What are the equivalence comparisons?",
          "answer": "To add perspective, time spent is translated into funny comparisons like Lord of the Rings movie viewings."
        },
        {
          "question": "How should I balance time wasting?",
          "answer": "Amusing distractions are a vital part of cognitive recovery. True time wasting is only a paradox when it stops being entertaining."
        },
        {
          "question": "Can we truly waste time?",
          "answer": "Time passes regardless of action. Whether a second is 'wasted' or 'invested' is entirely a matter of perspective and personal value."
        }
      ]
    }
  },
  {
    "id": "absurd-clocks",
    "slug": "absurd-clocks",
    "name": "Absurd Clocks",
    "description": "Watch paint dry, grass grow, snails walk, and ice melt in a grid of ridiculous real-time counters.",
    "category": "whimsical",
    "accent": "#3ABFBF",
    "needsAI": false,
    "seo": {
      "introText": "The Absurd Clocks is a collection of chronometers measuring things that have never needed measuring. Watch paint dry in real time, track global snail migration speed, and witness the dramatic countdown of instant ramen — all with the scientific precision these events absolutely deserve.",
      "howToSteps": [
        "Watch the paint drying canvas at the top — it tracks a real 4-hour drying cycle that persists across page visits. Absurdist messages appear at milestone percentages.",
        "Browse the smaller clocks below for specific time-wasting experiences. Start the tea timer, watch grass grow to six decimal places, or run the dramatic ramen countdown.",
        "Come back later — the paint remembers where it left off. Some experiences reward patience. Most do not."
      ],
      "faqs": [
        {
          "question": "Does the paint drying actually take 4 hours?",
          "answer": "Yes. The paint drying clock runs on real time — 4 hours of actual clock time for full drying. Your progress is saved in your browser session so you can leave and return to find the paint exactly as dry as it should be."
        },
        {
          "question": "Why does this exist?",
          "answer": "Time is finite and most of it is spent on things of questionable significance. The Absurd Clocks simply makes that fact visible and somewhat entertaining."
        },
        {
          "question": "Is the grass growth actually accurate?",
          "answer": "Yes. Grass grows at approximately 1cm per hour or 0.00000277 mm per second. The tracker uses this real figure, which is why it shows six decimal places — anything less would not change visibly."
        },
        {
          "question": "What happens when the paint is fully dry?",
          "answer": "A message appears and a Paint Again button lets you start the cycle over. Your previous drying time is cleared and a new color is randomly selected."
        }
      ]
    }
  },
  {
    "id": "cosmic-horror",
    "slug": "cosmic-horror",
    "name": "Cosmic Horror Clocks",
    "description": "Stare into dark timers countdown to the Andromeda collision and the death of our Sun.",
    "category": "cosmos",
    "accent": "#4B8EF1",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Cosmic Horror Clocks</strong> dashboard monitors terrifying timeline milestones. Watch countdowns to the death of the Sun, the collision of Andromeda, and final proton decay.",
      "howToSteps": [
        "Review the countdown timers ticking in red-tinted console format.",
        "Read the astrophysical descriptions explaining how each epoch terminates.",
        "Observe the dark void background and random starlight flashes."
      ],
      "faqs": [
        {
          "question": "When will the Sun die?",
          "answer": "The Sun will expand into a red giant and swallow the inner planets in approximately 5 billion years."
        },
        {
          "question": "What is proton decay?",
          "answer": "A hypothetical form of radioactive decay in which the proton decays into lighter subatomic particles, ending all matter in 10^36 years."
        },
        {
          "question": "How do scientists measure cosmic distances?",
          "answer": "Astronomers use standard candles, such as Type Ia supernovae and Cepheid variables, along with cosmic redshift measurements to calculate immense stellar distances."
        },
        {
          "question": "Is cosmic expansion speeding up?",
          "answer": "Yes, cosmological observations show that the expansion of the universe is accelerating, driven by dark energy which accounts for roughly 68% of the universe."
        }
      ]
    }
  },
  {
    "id": "time-paradox",
    "slug": "time-paradox",
    "name": "Time Paradox Playground",
    "description": "Test time travel actions for grandfather paradox safety, and audit timeline density.",
    "category": "scifi",
    "accent": "#7B61FF",
    "needsAI": false,
    "seo": {
      "introText": "The <strong>Time Paradox Playground</strong> lets you model historical interventions. Audit famous dates for traveler density, calculate deja vu probability, and test time loops.",
      "howToSteps": [
        "Type your time travel action to run the Grandfather Paradox Safety filter.",
        "Select dates to check local time traveler density statistics.",
        "Complete the loop escape questionnaire to check routine scores."
      ],
      "faqs": [
        {
          "question": "What is the Grandfather Paradox?",
          "answer": "A paradox occurring when a traveler goes back in time and prevents their grandfather from meeting their grandmother, preventing the traveler's birth."
        },
        {
          "question": "Why is July 4, 1776, flagged as overcrowded?",
          "answer": "Historic dates are checked against a fun density list indicating how many temporal tourists are visiting."
        },
        {
          "question": "What is a closed timelike curve?",
          "answer": "A closed timelike curve is a path in spacetime that loops back on itself in time, theoretically allowing physical particles to return to their own past under general relativity."
        },
        {
          "question": "What is the bootstrap paradox?",
          "answer": "A paradox of time travel where information or an object is sent back in time, becoming the very trigger for its own creation, leaving it with no true origin."
        }
      ]
    }
  },
  {
    "id": "personal-time-machine",
    "slug": "personal-time-machine",
    "name": "Personal Time Machine",
    "description": "Generate a personalized timeline of events, tech, and milestones since your birth date.",
    "category": "destiny",
    "accent": "#E09A3A",
    "needsAI": true,
    "seo": {
      "introText": "The <strong>Personal Time Machine</strong> generates a customized chronological matrix. Input your birthdate to let AI cross-reference historical giants, tech inventions, and pop culture milestones since you were born.",
      "howToSteps": [
        "Select your date of birth.",
        "Click generate to launch the AI timeline calculations.",
        "Review historical milestones and the custom summary poem."
      ],
      "faqs": [
        {
          "question": "What information does the report return?",
          "answer": "It lists figures alive at your birth, inventions created since your birth, and pop culture anniversaries."
        },
        {
          "question": "Is the final summary poem custom?",
          "answer": "Yes, the AI writes a custom 4-line poem summarizing your personal place in time."
        },
        {
          "question": "What is the significance of temporal alignment?",
          "answer": "It represents the intersection of universal cosmic milestones and individual conscious lifelines, highlighting our unique coordinates in time."
        },
        {
          "question": "Is my destiny predetermined?",
          "answer": "While physical laws outline the bounds of possibility, your conscious choices determine the actual path you take through the timeline."
        }
      ]
    }
  }
];
