import NewUserForm from "@/components/new-user-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth-utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.public.auth.newUser");
  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function NewUserPage(): Promise<React.JSX.Element | null> {
  const session = await requireAuth();
  const t = await getTranslations("app.public.auth.newUser");

  return (
    <Card className="max-w-lg mx-auto shadow-2xl shadow-primary">
      <CardHeader className="text-center">
        <CardTitle>{`${t("subTitle")} ${
          session.user.name || session.user.email
        }`}</CardTitle>
        <CardDescription>
          <p className="text-muted-foreground">{t("description")}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NewUserForm />
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground justify-center text-center">
        {t("note")}
      </CardFooter>
    </Card>
  );
}
