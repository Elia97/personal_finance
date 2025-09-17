import { getUserProfile } from "@/app/actions/user-actions";
import ProfileClient from "@/components/profile-client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("metadata.profile");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProfilePage() {
  const userData = await getUserProfile();
  const t = await getTranslations("profile");

  return (
    <div className="min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("description")}</p>
      </div>
      <ProfileClient initialUserData={userData} />
    </div>
  );
}
