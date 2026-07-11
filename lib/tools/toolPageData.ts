export type ToolPageData = {
  slug: string;
  name: string;
  group: string;
  groupName: string;
  groupAccent: string;
  description: string;
  seo: {
    title: string;
    metaDescription: string;
    introText: string;
    howToTitle: string;
    howToSteps: string[];
    sections?: { title: string; body: string }[];
    useCases: { title: string; content: string }[];
    faqs: { question: string; answer: string }[];
    internalLinksText: string;
    relatedToolSlugs: string[];
  };
  relatedRealmSlug?: string;
};
