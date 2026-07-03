import FinancialFreedomDashboard from "@/components/realms/experiences/FinancialFreedomDashboard";

export const metadata = {
  title: "Financial Freedom Dashboard | 6 Milestones Countdown | The God of Time",
  description:
    "Six simultaneous financial milestone countdowns: debt-free, $100k, $1M, work-optional, and financial peace — all on one timeline based on your real numbers.",
  keywords: ["financial freedom", "compound interest", "FIRE calculator", "work optional", "debt free countdown", "millionaire calculator"],
  openGraph: {
    title: "Financial Freedom Dashboard | The God of Time",
    description: "Enter your savings, income, and debt. See exactly when you hit every financial milestone — debt-free to work-optional.",
    url: "https://thegodoftime.com/realms/financial-freedom-dashboard",
  },
  alternates: { canonical: "https://thegodoftime.com/realms/financial-freedom-dashboard" },
};

export default function FinancialFreedomDashboardPage() {
  return <FinancialFreedomDashboard />;
}
