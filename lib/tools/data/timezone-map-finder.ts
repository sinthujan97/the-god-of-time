import { ToolPageData } from "../toolPageData";

export const timezoneMapFinderData: ToolPageData = {
  slug: "timezone-map-finder",
  name: "Time Zone Finder by Map Click",
  group: "global-time",
  groupName: "Global Time & Time Zones",
  groupAccent: "#D8F870",
  description: "Click anywhere on the interactive world map coordinates to identify the local timezone.",
  
  seo: {
    title: "Time Zone Finder by Map Click | Interactive Time Zone Map Selector",
    metaDescription: "Click or tap locations on an interactive world coordinate map to resolve IANA time zones, standard offsets, and country codes in real time.",
    introText: "The Time Zone Finder by Map Click provides a highly visual coordinate-to-timezone look-up interface. By clicking or tapping key regions on an SVG map of the world, users can immediately resolve latitude and longitude coordinates into official IANA timezone identifiers, country tags, and current active times.",
    howToTitle: "How to Use the Map Click Finder",
    howToSteps: [
      "Scroll down to view the stylized interactive SVG world map block.",
      "Click anywhere on the map grids to place a navigation pin.",
      "Read the calculated outputs below the map panel, including the resolved IANA name and standard GMT offset.",
      "Adjust the coordinate input fields manually if you have exact GPS decimals."
    ],
    useCases: [
      {
        title: "Geography and Timezone Education",
        content: "Visualize how timezones curve around continents and political borders rather than strictly running in straight longitudinal bands."
      },
      {
        title: "Client Relocation Planning",
        content: "Quickly map out a client's travel coordinates to determine what time offset they will experience."
      },
      {
        title: "IoT and GPS Asset Audits",
        content: "Identify what timezone standard an IoT device or shipping container should register based on reported GPS ping coordinates."
      }
    ],
    internalLinksText: "To verify offsets with a ticking terminal display, check the UTC/GMT Offset Finder. To compare relative offset differences, try the Time Zone Relative Difference Grid.",
    relatedToolSlugs: [
      "utc-gmt-offset",
      "timezone-difference-grid",
      "world-time-converter"
    ],
    faqs: [
      {
        question: "How accurate is the map click detection?",
        answer: "The map resolves coordinates to closest standard capital regions. Precise land borders are mapped using latitude/longitude boundaries."
      },
      {
        question: "Does clicking on the ocean return a timezone?",
        answer: "Clicking on international waters returns a calculated standard nautical timezone based on 15-degree longitudinal increments."
      },
      {
        question: "Does this map lookup work on mobile screens?",
        answer: "Yes, the SVG is fully responsive and supports touch points. You can also type coordinates manually on smaller screens."
      }
    ]
  }
};
