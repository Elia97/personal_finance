import { getUserProfile } from "@/app/actions/user-actions";
import ProfileClient from "@/components/profile-client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("app.dashboard.profile");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProfilePage() {
  const userData = await getUserProfile();
  const t = await getTranslations("app.dashboard.profile");

  return (
    <div className="min-h-screen">
      <h1 className="hidden">{t("title")}</h1>
      <ProfileClient initialUserData={userData} />
    </div>
  );
}
