import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import RealmExperience from "@/components/realms/RealmExperience";

interface RealmPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return realmsRegistry.map((realm) => ({ slug: realm.slug }));
}

export async function generateMetadata({ params }: RealmPageProps): Promise<Metadata> {
  const { slug } = await params;
  const realm = realmsRegistry.find((r) => r.slug === slug);
  if (!realm) return {};
  return {
    title: `${realm.name} | The God of Time`,
    description: realm.description,
    openGraph: {
      title: realm.name,
      description: realm.description,
      url: `https://thegodoftime.com/realms/${realm.slug}`,
    },
  };
}

export default async function RealmPage({ params }: RealmPageProps) {
  const { slug } = await params;
  const realm = realmsRegistry.find((r) => r.slug === slug);

  if (!realm) {
    notFound();
  }

  return (
    <RealmExperience slug={realm.slug} accentColor={realm.accent} />
  );
}
