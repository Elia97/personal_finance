import ForgotPasswordForm from "@/components/forgot-password-form";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.public.auth.forgotPassword");
  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ForgotPasswordPage(): Promise<React.JSX.Element> {
  const t = await getTranslations("app.public.auth.forgotPassword");

  return (
    <Card className="max-w-lg mx-auto shadow-2xl shadow-primary">
      <CardHeader className="text-center">
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          <p>{t("description")}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground justify-center text-center">
        {t("note")}
      </CardFooter>
    </Card>
  );
}
