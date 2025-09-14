import ChangePasswordForm from "@/components/change-password-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth-utils";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("metadata.change-password");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ChangePasswordPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const t = await getTranslations("auth.changePassword");

  return (
    <Card className="max-w-lg mx-auto shadow-2xl shadow-primary">
      <CardHeader className="text-center">
        <CardTitle>
          <h1 className="text-xl">{t("title")}</h1>
        </CardTitle>
        <CardDescription>
          <p>{t("description")}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}
