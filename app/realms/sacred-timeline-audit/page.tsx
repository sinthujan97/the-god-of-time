import SacredTimelineAudit from "@/components/realms/experiences/SacredTimelineAudit";

export const metadata = {
  title: "Sacred Timeline Audit | TVA Compliance Check | The God of Time",
  description:
    "Answer 8 questions about your life choices. The TVA classifies your unauthorized variants, assigns a compliance score, and predicts your Minority Report pre-crime arrest date.",
  keywords: ["sacred timeline", "TVA", "Loki", "time variance authority", "minority report", "pre-crime", "nexus event"],
  openGraph: {
    title: "Sacred Timeline Audit | The God of Time",
    description: "Submit your life data to the TVA. Receive your official compliance score, unauthorized variants list, and pre-crime arrest date.",
    url: "https://thegodoftime.com/realms/sacred-timeline-audit",
  },
  alternates: { canonical: "https://thegodoftime.com/realms/sacred-timeline-audit" },
};

export default function SacredTimelineAuditPage() {
  return <SacredTimelineAudit />;
}
