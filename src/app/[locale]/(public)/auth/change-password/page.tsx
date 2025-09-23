import ChangePasswordForm from "@/components/change-password-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-utils";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("app.public.auth.changePassword");
  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ChangePasswordPage() {
  await requireAuth();
  const t = await getTranslations("app.public.auth.changePassword");

  return (
    <Card className="max-w-lg mx-auto shadow-2xl shadow-primary">
      <CardHeader className="text-center">
        <CardTitle>{t("title")}</CardTitle>
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
