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
  const t = await getTranslations("metadata.forgot-password");
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
  const t = await getTranslations("auth.forgotPassword");

  return (
    <Card className="max-w-lg mx-auto shadow-2xl shadow-primary">
      <CardHeader className="text-center">
        <CardTitle>
          <h2 className="text-xl">{t("title")}</h2>
        </CardTitle>
        <CardDescription>
          <p className="text-muted-foreground">{t("description")}</p>
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
