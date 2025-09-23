import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import AuthError from "@/components/auth-error";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.public.auth.errorPage");
  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ErrorPage(): Promise<React.JSX.Element> {
  const t = await getTranslations("app.public.auth.errorPage");

  return (
    <Card className="max-w-lg mx-auto shadow-2xl shadow-primary text-center">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-destructive">
          <AuthError />
        </CardDescription>
      </CardContent>
      <CardFooter className="justify-center">
        <Button asChild variant="link" className="p-0">
          <Link href="/auth/signin">{t("backToSignin")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
