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
  const t = await getTranslations("metadata.verify-request");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function VerifyRequestPage() {
  const t = await getTranslations("auth.verifyRequest");
  return (
    <section className="w-full flex flex-col items-center justify-center min-h-screen py-4">
      <Card className="w-full max-w-lg shadow-2xl shadow-primary">
        <CardHeader>
          <CardTitle>
            <h2 className="text-2xl font-bold text-center">{t("title")}</h2>
          </CardTitle>
          <CardDescription>
            <p className="text-center text-sm text-gray-600">
              {t("description")}
            </p>
          </CardDescription>
        </CardHeader>
        <ResendEmail />
        <CardFooter>
          <p className="text-center w-full text-xs text-gray-400">
            {t("note")}
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
