import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  AnnualSummary,
  QuickActions,
  StatsCards,
  Timeline,
} from "@/components/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.dashboard");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const t = await getTranslations("app.dashboard");

  return (
    <div className="space-y-6">
      <h1 className="hidden">{t("title")}</h1>
      <AnnualSummary />
      <StatsCards />
      <QuickActions />
      <Timeline />
    </div>
  );
}
