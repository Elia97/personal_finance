import { getSettingsDataAction } from "@/app/actions/settings-actions";
import SettingsClient from "@/components/settings-client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("app.dashboard.settings");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SettingsPage() {
  const settingsData = await getSettingsDataAction();
  const t = await getTranslations("app.dashboard.settings");

  return (
    <div className="min-h-screen">
      <h1 className="hidden">{t("title")}</h1>
      <SettingsClient
        initialCategories={settingsData.categories}
        initialGoals={settingsData.goals}
      />
    </div>
  );
}
