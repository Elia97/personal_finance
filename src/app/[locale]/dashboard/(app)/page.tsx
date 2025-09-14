import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
    <div className="min-h-screen p-4 md:p-6">
      <div className="absolute top-2 left-2 md:hidden">
        <SidebarTrigger />
      </div>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-balance">{t("title")}</h1>
          <p className="text-muted-foreground text-pretty">
            {t("description")}
          </p>
        </div>

        <QuickActions />

        <AnnualSummary />

        <StatsCards />

        <Timeline />
      </div>
    </div>
  );
}
