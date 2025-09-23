import ResetPasswordForm from "@/components/reset-password-form";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.public.auth.resetPassword");
  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ResetPasswordPage(): Promise<React.JSX.Element> {
  const t = await getTranslations("app.public.auth.resetPassword");

  return (
    <Card className="max-w-lg mx-auto shadow-2xl shadow-primary">
      <CardHeader className="text-center">
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          <p className="text-muted-foreground">{t("description")}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
