import { getUserProfile } from "@/lib/auth-utils";
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

  return (
    <div className="min-h-screen p-6 space-y-8">
      <ProfileClient initialUserData={userData} />
    </div>
  );
}
