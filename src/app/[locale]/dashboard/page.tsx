import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import AnnualSummary from "@/components/dashboard/annual-summary";
import QuickActions from "@/components/dashboard/quick-actions";
import StatsCards from "@/components/dashboard/stats-cards";
import Timeline from "@/components/dashboard/timeline";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.dashboard");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center">{t("title")}</h1>

      <AnnualSummary />

      <QuickActions />

      <StatsCards />

      <Timeline />
    </div>
  );
}
