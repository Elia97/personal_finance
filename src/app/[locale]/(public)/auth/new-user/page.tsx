import NewUserForm from "@/components/new-user-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.new-user");
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
  const session = await getServerSession();
  if (!session) return null;

  const t = await getTranslations("auth.newUser");

  return (
    <Card className="max-w-lg mx-auto shadow-2xl shadow-primary">
      <CardHeader className="text-center">
        <CardTitle>
          <h1 className="text-xl">{t("title")}</h1>
        </CardTitle>
        <CardDescription>
          <p className="text-muted-foreground">{`${t("welcome")}, ${
            session.user.name || session.user.email
          }! ${t("description")}`}</p>
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
