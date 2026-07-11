import WorkTimeAudit from "@/components/realms/experiences/WorkTimeAudit";

export const metadata = {
  title: "Work Time Audit | Years Lost to Commute & Meetings | The God of Time",
  description:
    "Your commute is 1.5 years of your life. Meetings are 4 years. Shoe-tying is 2 weeks. See every block of time your work life consumes — and what it could have been instead.",
  keywords: ["work time calculator", "commute time life", "hours in meetings lifetime", "time audit", "life hours calculator", "work life balance"],
  openGraph: {
    title: "Work Time Audit | The God of Time",
    description: "How many years of your life will go to meetings, commuting, laundry, and shoe-tying? The answer is more than you expect.",
    url: "/realms/work-time-audit",
  },
  alternates: { canonical: "/realms/work-time-audit" },
};

export default function WorkTimeAuditPage() {
  return <WorkTimeAudit />;
}
