import React from "react";
import { Metadata } from "next";
import { petAgeTranslatorData } from "@/lib/tools/data/pet-age-translator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import PetAgeTranslatorInputs from "@/components/tools/inputs/PetAgeTranslatorInputs";

export const metadata: Metadata = {
  title: petAgeTranslatorData.seo.title,
  description: petAgeTranslatorData.seo.metaDescription,
  alternates: {
    canonical: `/tools/${petAgeTranslatorData.slug}`,
  },
  openGraph: {
    title: petAgeTranslatorData.seo.title,
    description: petAgeTranslatorData.seo.metaDescription,
    url: `/tools/${petAgeTranslatorData.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function ToolPage() {
  return (
    <ToolPageTemplate
      data={petAgeTranslatorData}
      InputsComponent={PetAgeTranslatorInputs}
    />
  );
}
