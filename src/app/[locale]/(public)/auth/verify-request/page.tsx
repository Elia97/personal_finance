import ResendEmail from "@/components/resend-email";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("app.public.auth.verifyRequest");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function VerifyRequestPage() {
  const t = await getTranslations("app.public.auth.verifyRequest");
  return (
    <section className="w-full flex flex-col items-center justify-center min-h-screen py-4">
      <Card className="w-full max-w-lg shadow-2xl shadow-primary">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
            <p className="text-center text-sm text-muted-foreground">
              {t("description")}
            </p>
          </CardDescription>
        </CardHeader>
        <ResendEmail />
        <CardFooter>
          <p className="text-center w-full text-xs text-muted-foreground">
            {t("note")}
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
